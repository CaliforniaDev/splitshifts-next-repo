import { z } from 'zod';
import { signUpFormSchema } from '../../validation/auth-schema';

// Form shape from validation schema
export type SignUpFormData = z.infer<typeof signUpFormSchema>

// Alias for server action input (same as form)
export type RegisterUserTypes = SignUpFormData;

// Server action response structure
export interface RegisterUserResponse {
  error: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  requiresEmailVerification?: boolean;
}