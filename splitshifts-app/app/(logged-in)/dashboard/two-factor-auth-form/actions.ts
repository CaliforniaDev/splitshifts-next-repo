'use server';
import { auth } from '@/auth';
import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { authenticator } from 'otplib';
import { eq } from 'drizzle-orm';

export const getTwoFactorSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: 'Unauthorized',
    };
  }
  const currentUserId = parseInt(session.user.id);

  const [user] = await db
    .select({
      email: users.email,
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, currentUserId));

  if (!user) {
    return {
      error: true,
      message: 'User not found',
    };
  }
  let twoFactorSecret = user.twoFactorSecret;
  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generateSecret();
    await db
      .update(users)
      .set({
        twoFactorSecret,
      })
      .where(eq(users.id, currentUserId));
  }
  return {
    twoFactorSecret: authenticator.keyuri(
      user.email,
      'SplitShifts App',
      twoFactorSecret,
    ),
  };
};

export const activateTwoFactorAuth = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: true, message: 'Unauthorized' };
  }

  const currentUserId = parseInt(session.user.id);

  // Fetch user's existing 2FA secret
  const [user] = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.id, currentUserId));

  // Explicitly check if the user exists
  if (!user) {
    return { error: true, message: 'User not found' };
  }

  if (user.twoFactorSecret) {
    const isTokenValid = authenticator.check(token, user.twoFactorSecret);

    if (!isTokenValid) {
      return { error: true, message: 'Invalid OTP' };
    }

    await db
      .update(users)
      .set({ twoFactorEnabled: true })
      .where(eq(users.id, currentUserId));
  }
};

export const disableTwoFactorAuth = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: true, message: 'Unauthorized' };
  }
  const currentUserId = parseInt(session.user.id);

  await db
    .update(users)
    .set({ twoFactorEnabled: false })
    .where(eq(users.id, currentUserId));

  return {
    success: true,
    message: 'Two-factor authentication disabled successfully',
  };
};
