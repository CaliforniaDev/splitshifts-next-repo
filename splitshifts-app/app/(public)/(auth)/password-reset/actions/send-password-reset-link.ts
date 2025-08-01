'use server';

import { auth } from '@/auth';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/usersSchema';
import { passwordResetTokenSchema } from '@/db/passwordResetTokenSchema';
import { mailer } from '@/app/lib/email';
import { buildPasswordResetLink, generateSecureToken } from '@/app/lib/utils';

/**
 * Retrieves the user from the database based on their email address.
 * This function is used to verify if the user exists before performing
 * actions like sending a password reset link.
 *
 * @param emailAddress - The email address of the user to look up.
 * @returns The user object if found, or undefined if no user exists with the given email.
 */
const getCurrentUser = async (emailAddress: string) => {
  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, emailAddress));
  return user;
};

export async function resetPassword(emailAddress: string) {
  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message: 'You are already logged in.',
    };
  }

  const user = await getCurrentUser(emailAddress);
  // ! If the user doesn't exist, empty response due to security reasons
  if (!user) {
    return;
  }

  // Generate a cryptographically secure password reset token
  // Uses the same secure token generation as email verification (256-bit entropy)
  // Password reset tokens have shorter expiration (1 hour vs 24 hours) for enhanced security
  // as they provide direct access to account credential changes
  const passwordResetToken = generateSecureToken();
  const onHour = 3600000; // 1 hour in milliseconds
  const tokenExpiration = new Date(Date.now() + onHour); // Current time + 1 hour
  await db
    .insert(passwordResetTokenSchema)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiration,
    })
    .onConflictDoUpdate({
      target: [passwordResetTokenSchema.userId],
      set: {
        token: passwordResetToken,
        tokenExpiration,
      },
    });
  const resetLink = buildPasswordResetLink(passwordResetToken);

  // Development mode: Log password reset link to console
  if (process.env.NODE_ENV === 'development') {
    console.log('🔗 PASSWORD RESET LINK:', resetLink);
    console.log('📧 Would send to:', emailAddress);
  }

  try {
    await mailer.sendMail({
      from: process.env.EMAIL_FROM || 'test@resend.dev',
      subject: 'Password Reset Request - SplitShifts',
      to: emailAddress,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password for your SplitShifts account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          
          <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    // In development, still return success even if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '⚠️ Email failed to send (this is okay in development):',
        emailError,
      );
      return {
        success: true,
        message:
          'Password reset email sent successfully. (Check console for reset link)',
      };
    }
    throw emailError;
  }

  return {
    success: true,
    message: 'Password reset email sent successfully.',
  };
}
