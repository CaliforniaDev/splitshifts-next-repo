'use server';
import { auth } from '@/auth';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { users } from '@/db/schema/usersSchema';

import {
  ChangePasswordData,
  ChangePasswordResponse,
} from '../types/change-password-data';
import { changePasswordSchema } from '../validation/change-password-schema';

export const changePassword = async (
  data: ChangePasswordData,
): Promise<ChangePasswordResponse> => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        error: true,
        message: 'You must be logged in to change your password.',
      };
    }
    const passwordValidation = changePasswordSchema.safeParse(data);

    if (passwordValidation?.error) {
      return {
        error: true,
        message:
          passwordValidation.error.issues?.[0]?.message ?? 'An error occurred',
      };
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id));

    if (!user) {
      return {
        error: true,
        message: 'User not found.',
      };
    }

    const passwordMatch = await compare(data.currentPassword, user.password);
    if (!passwordMatch) {
      return {
        error: true,
        message: 'Current password is incorrect.',
      };
    }

    const hashedPassword = await hash(data.password, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, session.user.id));
    return {
      error: false,
      message: 'Password changed successfully.',
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      error: true,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
};
