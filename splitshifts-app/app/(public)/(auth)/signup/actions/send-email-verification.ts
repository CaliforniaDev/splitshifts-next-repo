'use server';

import { auth } from '@/auth';
import db from '@/db/drizzle';
import { eq, lt } from 'drizzle-orm';
import { users } from '@/db/usersSchema';
import { emailVerificationTokenSchema } from '@/db/emailVerificationTokenSchema';
import { mailer } from '@/app/lib/email';
import { logError, buildVerificationLink, generateSecureToken } from '@/app/lib/utils';

/**
 * Retrieves the user from the database based on their email address.
 * This function is used to verify if the user exists before sending
 * email verification.
 *
 * @param emailAddress - The email address of the user to look up.
 * @returns The user object if found, or undefined if no user exists with the given email.
 */
const getUserByEmail = async (emailAddress: string) => {
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.email, emailAddress));
  return user;
};

/**
 * Sends an email verification link to the user's email address.
 * Creates a secure token that expires in 24 hours and sends it via email.
 *
 * @param emailAddress - The email address to send the verification link to.
 * @returns Success/error response or undefined for security reasons.
 */
export async function sendEmailVerification(emailAddress: string) {
  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message: 'You are already logged in.',
    };
  }

  const user = await getUserByEmail(emailAddress);
  
  // If the user doesn't exist, return empty response for security reasons
  if (!user) {
    return;
  }

  // If user is already verified, don't send another email
  if (user.emailVerified) {
    return {
      error: true,
      message: 'Email is already verified.',
    };
  }

  // Generate a cryptographically secure verification token
  // Uses randomBytes(32) resulting in a 64-character hex string with 256 bits of entropy
  // This entropy level is cryptographically strong and sufficient for email verification tokens
  // 
  // Token format choice: Simple hex string vs JWT
  // - Hex tokens: Lightweight, stateful (revokable), require database validation
  // - JWT tokens: Self-contained, larger size, harder to revoke, embedded expiration
  // 
  // For email verification, we prefer hex tokens because:
  // 1. We need database lookup anyway to update user verification status
  // 2. Tokens should be revokable (user changes email, etc.)
  // 3. Simpler implementation reduces attack surface
  // 4. 256-bit entropy provides excellent security
  const verificationToken = generateSecureToken();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const tokenExpiration = new Date(Date.now() + twentyFourHours);

  // Clean up any expired tokens before creating a new one
  await db
    .delete(emailVerificationTokenSchema)
    .where(
      lt(emailVerificationTokenSchema.tokenExpiration, new Date())
    );

  await db
    .insert(emailVerificationTokenSchema)
    .values({
      userId: user.id,
      token: verificationToken,
      tokenExpiration,
    })
    .onConflictDoUpdate({
      target: [emailVerificationTokenSchema.userId],
      set: {
        token: verificationToken,
        tokenExpiration,
      },
    });

  // Build verification link with error handling
  let verificationLink: string;
  try {
    verificationLink = buildVerificationLink(verificationToken);
  } catch (urlError) {
    console.error('Failed to build verification link:', urlError);
    return {
      error: true,
      message: 'Failed to generate verification link. Please contact support.',
    };
  }

  // Development mode: Log verification link to console
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 EMAIL VERIFICATION LINK:', verificationLink);
    console.log('📧 Would send to:', emailAddress);
    console.log('👤 User:', user.firstName);
  }

  try {
    await mailer.sendMail({
      from: process.env.EMAIL_FROM || 'test@resend.dev',
      subject: 'Verify your email address - SplitShifts',
      to: emailAddress,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to SplitShifts, ${user.firstName}!</h2>
          <p>Thank you for signing up. To complete your registration, please verify your email address by clicking the link below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          
          <p><strong>This link will expire in 24 hours.</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with SplitShifts, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    // In development, still return success even if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Email failed to send (this is okay in development):', emailError);
      return {
        success: true,
        message: 'Verification email sent successfully. (Check console for verification link)',
      };
    }
    throw emailError;
  }

  return {
    success: true,
    message: 'Verification email sent successfully.',
  };
}
