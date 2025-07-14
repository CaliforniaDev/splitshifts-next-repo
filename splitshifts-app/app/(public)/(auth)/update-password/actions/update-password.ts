'use server';
import { eq } from 'drizzle-orm';

import db from '@/db/drizzle';
import { passwordResetTokenSchema } from '@/db/passwordResetTokenSchema';

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
  return {
    error: true,
    message: 'This is a placeholder response. Implement the actual update logic.',
  }
};
