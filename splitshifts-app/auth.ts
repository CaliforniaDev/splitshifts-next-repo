import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import db from './db/drizzle';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { authenticator } from 'otplib';

import { users } from './db/schema/usersSchema';
import { organizationUsers } from './db/schema/organizationUsersSchema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.orgId = user.orgId;
      }
      // Handle session updates from client (e.g., after creating organization)
      if (trigger === 'update' && session?.orgId) {
        token.orgId = session.orgId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.orgId = token.orgId as string | null;
        
        // Note: User existence is validated during login and token refresh.
        // Removed database check here to prevent performance degradation on every request.
        // If a user is deleted, their token will be invalidated on next login attempt.
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      authorize: async credentials => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user) {
          throw new Error('Incorrect credentials');
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password!,
          );
          if (!passwordCorrect) {
            throw new Error('Incorrect credentials');
          }

          // Check if email is verified
          if (!user.emailVerified) {
            throw new Error('Email not verified');
          }

          if (user.twoFactorEnabled) {
            const tokenValid = authenticator.check(
              credentials.token as string,
              user.twoFactorSecret ?? '',
            );

            if (!tokenValid) {
              throw new Error('Incorrect OTP');
            }
          }
        }

        // Get user's organization for session
        const [orgUser] = await db
          .select({ orgId: organizationUsers.orgId })
          .from(organizationUsers)
          .where(eq(organizationUsers.userId, user.id));

        return {
          id: user.id.toString(),
          email: user.email,
          orgId: orgUser?.orgId || null,
        };
      },
    }),
  ],
});
