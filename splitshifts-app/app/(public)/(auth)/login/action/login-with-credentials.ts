'use server';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { signIn } from '@/auth';

import db from '@/db/drizzle';
import { users } from '@/db/usersSchema';
import { loginFormSchema } from '@/app/(public)/(auth)/validation/auth-schema';
import { LoginFormData, LoginResponse } from '../types/login-form-data';

export const loginWithCredentials = async (
  data: LoginFormData,
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
    // Provide different error messages based on whether OTP was provided
    const errorMessage = token 
      ? 'Invalid OTP code. Please check your authenticator app and try again.'
      : 'Incorrect email or password.';
    
    return {
      error: true,
      message: errorMessage,
    };
  }
};

export const preLoginCheck = async (
  data: Pick<LoginFormData, 'email' | 'password'>,
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
      message: 'Incorrect email or password.',
    };
  }

  // Compare the provided password with the stored hashed password

  const passwordCorrect = await compare(data.password, user.password!);
  if (!passwordCorrect) {
    return {
      error: true,
      message: 'Incorrect email or password.',
    };
  }
  return {
    error: false,
    twoFactorEnabled: user.twoFactorEnabled,
  };
};
