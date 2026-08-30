import type { Request, Response } from 'express';
import type FilterQuery from 'mongoose';
import 'dotenv/config';

import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';

import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';

import { auth } from './auth.js';
import { connectToMongo } from './db/mongodb/mongo.connection.js';
import { getquestions, getSubjects } from './controller/subject.controller.js';

const app = express();

const API_URL = process.env.BETTER_AUTH_URL!;

type MobileCode = {
  sessionToken: string;
  expiresAt: number;
};

const mobileCodes = new Map<string, MobileCode>();

function createMobileCode(sessionToken: string): string {
  const code = crypto.randomBytes(32).toString('base64url');

  mobileCodes.set(code, {
    sessionToken,
    expiresAt: Date.now() + 60_000,
  });

  return code;
}

function consumeMobileCode(code: string): string | null {
  const entry = mobileCodes.get(code);

  if (!entry) {
    return null;
  }

  // One-time use.
  mobileCodes.delete(code);

  if (Date.now() > entry.expiresAt) {
    return null;
  }

  return entry.sessionToken;
}

setInterval(() => {
  const now = Date.now();

  for (const [code, entry] of mobileCodes.entries()) {
    if (now > entry.expiresAt) {
      mobileCodes.delete(code);
    }
  }
}, 30_000).unref();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.get('/api/mobile/github', async (req, res) => {
  console.log('MOBILE GITHUB REQUEST:', {
    origin: req.headers.origin,
    cookies: req.headers.cookie,
    userAgent: req.headers['user-agent'],
  });

  try {
    const response = await auth.api.signInSocial({
      body: {
        provider: 'github',
        callbackURL: `${API_URL}/api/mobile/callback`,
      },

      headers: req.headers as Record<string, string>,

      asResponse: true,
    });

    const setCookie = response.headers.getSetCookie();

    console.log('MOBILE GITHUB SET-COOKIE:', setCookie);

    if (setCookie.length > 0) {
      res.setHeader('Set-Cookie', setCookie);
    }

    const location = response.headers.get('location');

    console.log('MOBILE GITHUB REDIRECT:', location);

    if (location) {
      return res.redirect(302, location);
    }

    const body = await response.text();

    return res.status(response.status).type('application/json').send(body);
  } catch (error) {
    console.error('MOBILE GITHUB ERROR:', error);

    return res.status(500).json({
      error: 'Failed to start GitHub OAuth',
    });
  }
});
app.get('/api/mobile/callback', async (req, res) => {
  console.log('MOBILE CALLBACK REQUEST:', {
    cookies: req.headers.cookie,
    userAgent: req.headers['user-agent'],
  });

  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      console.error('MOBILE CALLBACK: NO SESSION');

      return res.status(401).send('Authentication session not found');
    }

    console.log('MOBILE CALLBACK USER:', {
      id: session.user.id,
      email: session.user.email,
    });

    /**
     * Extract the actual Better Auth session token from
     * the browser cookie.
     */
    const cookieHeader = req.headers.cookie ?? '';

    const sessionTokenMatch = cookieHeader.match(
      /(?:^|;\s*)better-auth\.session_token=([^;]+)/,
    );

    if (!sessionTokenMatch) {
      console.error(
        'MOBILE CALLBACK: better-auth.session_token cookie missing',
      );

      return res.status(401).send('Session token not found');
    }

    const sessionToken = decodeURIComponent(sessionTokenMatch[1] as string);

    const code = createMobileCode(sessionToken);

    console.log('MOBILE CALLBACK: MOBILE CODE CREATED');

    const mobileCallback = new URL('apyqs://auth/callback');

    mobileCallback.searchParams.set('code', code);

    console.log('MOBILE CALLBACK REDIRECT:', mobileCallback.toString());

    return res.redirect(302, mobileCallback.toString());
  } catch (error) {
    console.error('MOBILE CALLBACK ERROR:', error);

    return res.status(500).send('Mobile authentication failed');
  }
});

app.post('/api/mobile/exchange', async (req, res) => {
  try {
    const { code } = req.body ?? {};

    if (typeof code !== 'string' || code.length < 20) {
      return res.status(400).json({
        error: 'Invalid mobile authentication code',
      });
    }

    const sessionToken = consumeMobileCode(code);

    if (!sessionToken) {
      return res.status(401).json({
        error: 'Mobile authentication code is invalid or expired',
      });
    }

    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `better-auth.session_token=${encodeURIComponent(sessionToken)}`,
      }),
    });

    if (!session) {
      return res.status(401).json({
        error: 'Authentication session is no longer valid',
      });
    }

    console.log('MOBILE EXCHANGE SUCCESS:', {
      userId: session.user.id,
      email: session.user.email,
    });

    return res.json({
      sessionToken,
      user: session.user,
      session: session.session,
    });
  } catch (error) {
    console.error('MOBILE EXCHANGE ERROR:', error);

    return res.status(500).json({
      error: 'Authentication exchange failed',
    });
  }
});
app.all('/api/auth/{*splat}', async (req, res) => {
  console.log('AUTH REQUEST:', {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    cookies: req.headers.cookie,
  });

  await toNodeHandler(auth)(req, res);

  console.log('AUTH RESPONSE:', {
    status: res.statusCode,
    location: res.getHeader('location'),
    setCookie: res.getHeader('set-cookie'),
  });
});

// Escape special regex characters

app.get('/api/questions', getquestions);
app.get('/api/subject/:branch', getSubjects);

app.listen(3000, '0.0.0.0', async () => {
  await connectToMongo();
  console.log('APYQS server running on port 3000');
});
