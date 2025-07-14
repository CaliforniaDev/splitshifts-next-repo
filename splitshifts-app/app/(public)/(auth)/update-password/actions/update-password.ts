'use server';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import db from '@/db/drizzle';
import { passwordMatchSchema } from '@/app/(public)/(auth)/validation/auth-schema';
import { passwordResetTokenSchema } from '@/db/passwordResetTokenSchema';
import { hash } from 'bcryptjs';
import { users } from '@/db/usersSchema';

// Checks if a token exists and is not expired
export const validateResetToken = async (token: string): Promise<boolean> => {
  if (!token) return false;

  const [passwordResetToken] = await db
    .select()
    .from(passwordResetTokenSchema)
    .where(eq(passwordResetTokenSchema.token, token));
  const now = Date.now();

  return (
    !!passwordResetToken?.tokenExpiration &&
    now < passwordResetToken.tokenExpiration.getTime()
  );
};

// Placeholder password update function — still needs full implementation
export const updatePassword = async ({
  token,
  password,
  passwordConfirm,
}: {
  token: string;
  password: string;
  passwordConfirm: string;
}) => {
  const passwordValidation = passwordMatchSchema.safeParse({
    password,
    passwordConfirm,
  });
  // 🛠 Validate password match using Zod schema
  if (!passwordValidation.success) {
    return {
      error: true,
      message:
        passwordValidation.error.issues[0]?.message ?? 'An error occurred',
    };
  }

  // 🚫 Prevent logged-in users from resetting passwords
  const session = await auth();
  if (session?.user?.id) {
    return {
      error: true,
      message: 'Already logged in. Please log out to update your password.',
    };
  }

  // 🔍 Validate the reset token
  const isTokenValid = (await token) ? validateResetToken(token) : false;
  if (!isTokenValid) {
    return {
      error: true,
      message: 'Your token is invalid or has expired',
      tokenInvalid: true,
    };
  }

  // 🔑 Hash the new password before saving
  const hashedPassword = await hash(password, 10);

  //! 📝 Find the password reset token in the database (TEMPORARY)
  const [passwordResetToken] = await db
    .select()
    .from(passwordResetTokenSchema)
    .where(eq(passwordResetTokenSchema.token, token));

  // 📝 Update the user's password in the database
  await db
    .update(users)
    .set({
      password: hashedPassword,
    })
    .where(eq(users.id, passwordResetToken.userId!));

  // 🗑️ Delete the used password reset token from the database
  await db
    .delete(passwordResetTokenSchema)
    .where(eq(passwordResetTokenSchema.id, passwordResetToken.id));
};
