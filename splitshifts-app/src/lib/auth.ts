

import NextAuth from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';
import PostgresAdapter from '@auth/pg-adapter';
import { Pool } from '@neondatabase/serverless';

export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  const pool = new Pool({ connectionString: process.env.DATA_BASE_URL });
  return {
    adapter: PostgresAdapter(pool),
    providers: [
      Auth0({
        clientId: process.env.AUTH_AUTH0_ID,
        clientSecret: process.env.AUTH_AUTH0_SECRET,
        issuer: process.env.AUTH_AUTH0_ISSUER,
      }),
    ],
  };
});
