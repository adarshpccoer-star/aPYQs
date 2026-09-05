// server/utils/mobile-session.ts

import type { Request } from 'express';
import { auth } from '../auth.js';

export async function getMobileSession(req: Request) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    console.log('MOBILE SESSION: Missing Bearer token');
    return null;
  }

  const sessionToken = authorization.slice('Bearer '.length).trim();

  if (!sessionToken) {
    console.log('MOBILE SESSION: Empty Bearer token');
    return null;
  }

  try {
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: `__Secure-better-auth.session_token=${encodeURIComponent(
          sessionToken,
        )}`,
      }),
    });

    if (!session) {
      console.log('MOBILE SESSION: Invalid or expired session');
      return null;
    }

    console.log('MOBILE SESSION: Authenticated', {
      userId: session.user.id,
      email: session.user.email,
    });

    return session;
  } catch (error) {
    console.error('MOBILE SESSION ERROR:', error);
    return null;
  }
}
