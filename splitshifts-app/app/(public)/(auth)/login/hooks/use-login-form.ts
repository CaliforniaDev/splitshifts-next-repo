// ---Core Framework---------------------------------------------------
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// ---Validation Schemas-----------------------------------------------
import { loginFormSchema, otpSchema } from '../../validation/auth-schema';

// ---Types------------------------------------------------------------
import { LoginFormData, OtpFormData } from '../types/login-form-data';

/**
 * Custom hook for managing the login form state and validation.
 * Handles email and password input validation using the loginFormSchema.
 * 
 * @returns useForm instance configured for login form data
 */
export const useLoginForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
};

/**
 * Custom hook for managing the OTP form state and validation.
 * Validates 6-digit numeric OTP input using the otpSchema.
 * 
 * @returns useForm instance configured for OTP form data
 */
export const useOtpForm = () => {
  return useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });
};
