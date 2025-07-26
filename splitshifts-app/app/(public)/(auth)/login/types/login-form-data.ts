import { z } from 'zod';
import { loginFormSchema } from '@/app/(public)/(auth)/validation/auth-schema';
import { otpSchema } from '@/app/(public)/(auth)/validation/auth-schema';

// Form shape from validation schema
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;

export interface LoginResponse {
  error: boolean;
  message?: string;
}
