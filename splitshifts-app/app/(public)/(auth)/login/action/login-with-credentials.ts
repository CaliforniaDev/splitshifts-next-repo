'use server';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { signIn } from '@/auth';

import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { loginFormSchema } from '@/app/(public)/(auth)/validation/auth-schema';
import { LoginUserData, LoginResponse } from '../types/login-form-data';

export const loginWithCredentials = async (
  data: LoginUserData,
): Promise<LoginResponse> => {
  const validation = loginFormSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error?.issues[0]?.message ?? 'An error occurred',
    };
  }
  const { email, password, token } = validation.data;

  try {
    const response = await signIn('credentials', {
      email,
      password,
      token,
      redirect: false,
    });
    if (response?.error) {
      return {
        error: true,
        message: response.error,
      };
    }
    return {
      error: false,
    };
  } catch (e) {
    return {
      error: true,
      message: 'Incorrect email or password.',
    };
  }
};

export const preLoginCheck = async (
  data: Pick<LoginUserData, 'email' | 'password'>,
): Promise<LoginResponse & { twoFactorEnabled?: boolean }> => {
  // Fetch the user from the database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  //Check if user exists
  if (!user) {
    return {
      error: true,
      message: 'Incorrect credentials',
    };
  }

  // Compare the provided password with the stored hashed password

  const passwordCorrect = await compare(data.password, user.password!);
  if (!passwordCorrect) {
    return {
      error: true,
      message: 'Incorrect credentials',
    };
  }
  return {
    error: false,
    twoFactorEnabled: user.twoFactorEnabled,
  };
};
