import { z } from 'zod';
import { loginFormSchema } from '@/app/(auth)/validation/auth-schema';

// Form shape from validation schema
export type LoginFormData = z.infer<typeof loginFormSchema>;

export type LoginUserData = LoginFormData;

export interface LoginResponse {
  error: boolean;
  message?: string;
}
