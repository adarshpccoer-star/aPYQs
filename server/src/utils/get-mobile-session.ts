// server/utils/mobile-session.ts

import type { Request } from 'express';
import { auth } from '../auth.js';
export async function getMobileSession(req: Request) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  const sessionToken = authorization.slice('Bearer '.length);

  return auth.api.getSession({
    headers: new Headers({
      cookie: `better-auth.session_token=${encodeURIComponent(sessionToken)}`,
    }),
  });
}
