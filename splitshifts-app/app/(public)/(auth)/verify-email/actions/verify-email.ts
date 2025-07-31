'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { eq, and, gt } from 'drizzle-orm';
import { users } from '@/db/usersSchema';
import { emailVerificationTokenSchema } from '@/db/emailVerificationTokenSchema';

/**
 * Verifies a user's email address using the provided token.
 * Updates the user's email verification status and removes the token.
 *
 * @param token - The verification token from the email link.
 * @returns Success/error response with appropriate message.
 */
export async function verifyEmail(token: string) {
  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message: 'You are already logged in.',
    };
  }

  // Validate token format: must be a 64-character hexadecimal string
  const isValidToken = typeof token === 'string' && /^[a-fA-F0-9]{64}$/.test(token);
  if (!isValidToken) {
    return {
      error: true,
      message: 'Invalid verification token.',
    };
  }

  // Find the verification token and associated user
  const [verificationData] = await db
    .select({
      userId: emailVerificationTokenSchema.userId,
      tokenExpiration: emailVerificationTokenSchema.tokenExpiration,
      userEmail: users.email,
      emailVerified: users.emailVerified,
    })
    .from(emailVerificationTokenSchema)
    .innerJoin(users, eq(emailVerificationTokenSchema.userId, users.id))
    .where(
      and(
        eq(emailVerificationTokenSchema.token, token),
        gt(emailVerificationTokenSchema.tokenExpiration, new Date())
      )
    );

  if (!verificationData) {
    return {
      error: true,
      message: 'Invalid or expired verification token.',
    };
  }

  // Check if email is already verified
  if (verificationData.emailVerified) {
    // Clean up the token since email is already verified
    await db
      .delete(emailVerificationTokenSchema)
      .where(eq(emailVerificationTokenSchema.userId, verificationData.userId));
    
    return {
      error: true,
      message: 'Email address is already verified.',
    };
  }

  // Update user's email verification status
  await db
    .update(users)
    .set({
      emailVerified: true,
      emailVerifiedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, verificationData.userId));

  // Remove the verification token
  await db
    .delete(emailVerificationTokenSchema)
    .where(eq(emailVerificationTokenSchema.userId, verificationData.userId));

  return {
    success: true,
    message: 'Email verified successfully! You can now log in.',
    metadata: {
      email: verificationData.userEmail,
    },
  };
}
