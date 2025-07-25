'use server';

import db from '@/db/drizzle';
import { hash } from 'bcryptjs';
import { users } from '@/db/usersSchema';
import { signUpFormSchema } from '../../validation/auth-schema';
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

    await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return { error: false, message: 'User registered successfully!' };
  } catch (error) {
    return handleError(error);
  }
};
