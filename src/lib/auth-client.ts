import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: 'http://192.168.1.43:3000',
});
