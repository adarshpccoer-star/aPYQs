import 'dotenv/config';

import dns from 'node:dns';
import net from 'node:net';

dns.setDefaultResultOrder('ipv4first');
net.setDefaultAutoSelectFamily(false);

import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
  max: 5,
});

pool.on('error', error => {
  console.error('Postgres pool error:', error);
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL!,

  database: pool,

  secret: process.env.BETTER_AUTH_SECRET!,

  trustedOrigins: ['http://192.168.1.43:3000', 'apyqs://', 'apyqs://auth'],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
