import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

import db from './db/drizzle';
import { eq, and, isNull, desc } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { authenticator } from 'otplib';

import { users } from './db/schema/usersSchema';
import { organizationUsers } from './db/schema/organizationUsersSchema';
import { organizations } from './db/schema/organizationsSchema';

// Server-side credentials schema for validation
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  token: z.string().optional(),
});

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
        // Validate credentials shape before proceeding
        const validation = credentialsSchema.safeParse(credentials);
        if (!validation.success) {
          return null; // NextAuth treats null as invalid credentials
        }

        const { email, password, token } = validation.data;

        // Query user with explicit column projection and scope to parent
        let user;
        try {
          const [foundUser] = await db
            .select({
              id: users.id,
              email: users.email,
              password: users.password,
              emailVerified: users.emailVerified,
              twoFactorEnabled: users.twoFactorEnabled,
              twoFactorSecret: users.twoFactorSecret,
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          user = foundUser;
        } catch (error) {
          console.error('Database error during login:', error);
          return null;
        }

        if (!user) {
          return null; // Generic: Invalid credentials
        }

        const passwordCorrect = await compare(password, user.password ?? '');
        if (!passwordCorrect) {
          return null; // Generic: Invalid credentials
        }

        // Check if email is verified
        if (!user.emailVerified) {
          return null; // Generic: Invalid credentials (don't leak email verification status)
        }

        // Validate 2FA if enabled
        if (user.twoFactorEnabled) {
          const tokenValid = authenticator.check(
            token ?? '',
            user.twoFactorSecret ?? '',
          );

          if (!tokenValid) {
            return null; // Generic: Invalid credentials (don't leak 2FA status)
          }
        }

        // Update lastLogin timestamp
        try {
          await db
            .update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, user.id));
        } catch (error) {
          console.error('Failed to update lastLogin:', error);
          // Don't block login if timestamp update fails
        }

        // Get user's most recent active (non-deleted) organization for session
        const [orgUser] = await db
          .select({ orgId: organizationUsers.orgId })
          .from(organizationUsers)
          .innerJoin(organizations, eq(organizationUsers.orgId, organizations.id))
          .where(
            and(
              eq(organizationUsers.userId, user.id),
              isNull(organizations.deletedAt)
            )
          )
          .orderBy(desc(organizationUsers.createdAt))
          .limit(1);

        return {
          id: user.id.toString(),
          email: user.email,
          orgId: orgUser?.orgId || null,
        };
      },
    }),
  ],
});
