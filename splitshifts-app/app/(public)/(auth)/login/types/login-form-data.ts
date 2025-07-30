import { z } from 'zod';
import { loginFormSchema } from '@/app/(public)/(auth)/validation/auth-schema';
import { otpSchema } from '@/app/(public)/(auth)/validation/auth-schema';

// Form shape from validation schema
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;

export type LoginErrorType = 
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'INVALID_OTP'
  | 'TWO_FACTOR_REQUIRED'
  | 'GENERIC_ERROR';

export interface LoginResponse {
  error: boolean;
  message?: string;
  errorType?: LoginErrorType;
  metadata?: {
    email?: string;
    twoFactorEnabled?: boolean;
    emailVerified?: boolean;
  };
}
