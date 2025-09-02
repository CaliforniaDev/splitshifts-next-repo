'use server';

import db from '@/db/drizzle';
import { hash } from 'bcryptjs';
import { users } from '@/db/schema/usersSchema';
import { signUpFormSchema } from '../../validation/auth-schema';
import { sendEmailVerification } from './send-email-verification';
import type {
  RegisterUserTypes,
  RegisterUserResponse,
} from '../types/signup-form-data';

interface CustomError extends Error {
  code?: string;
}

// Function to handle errors
const handleError = (error: unknown): RegisterUserResponse => {
  const customError = error as CustomError;

  // Handle duplicate email error
  if (customError.code === '23505') {
    return {
      error: true,
      fieldErrors: {
        email: 'An account is already registered with this email address',
      },
    };
  }
  return {
    error: true,
    message: 'An unexpected error occurred',
  };
};

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
  passwordConfirm,
}: RegisterUserTypes): Promise<RegisterUserResponse> => {
  try {
    // Validate user input
    const newUserValidation = signUpFormSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    if (!newUserValidation.success) {
      //  Map errors to the correct fields
      const fieldErrors = newUserValidation.error.issues.reduce(
        (acc, issue) => {
          const fieldName = issue.path[0];
          acc[fieldName] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return {
        error: true,
        fieldErrors,
      };
    }

    const hashedPassword = await hash(password, 12);

    // Create user account with email verification disabled initially
    await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerified: false, // User must verify email before logging in
    });

    // Send verification email
    const emailResult = await sendEmailVerification(email);
    
    if (emailResult?.error) {
      // If email sending fails, still consider registration successful
      // User can request another verification email later
      console.error('Failed to send verification email:', emailResult.message);
    }

    return { 
      error: false, 
      message: 'Account created successfully! Please check your email to verify your account before logging in.',
      requiresEmailVerification: true
    };
  } catch (error) {
    return handleError(error);
  }
};
