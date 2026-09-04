import 'dotenv/config';

import dns from 'node:dns';
import net from 'node:net';

import { bearer } from 'better-auth/plugins';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

dns.setDefaultResultOrder('ipv4first');
net.setDefaultAutoSelectFamily(false);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
  max: 5,
});

pool.on('error', error => {
  console.error('Postgres pool error:', error);
});
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log(
  'GOOGLE_CLIENT_SECRET:',
  process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
);
console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL);
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET!,

  plugins: [bearer()],

  trustedOrigins: [
    'https://boneless-voter-eatery.ngrok-free.dev',
    'apyqs://',
    'apyqs://auth',
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  advanced: {
    useSecureCookies: true,

    crossSubdomainCookies: {
      enabled: false,
    },

    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },
});
