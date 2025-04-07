import { z } from 'zod';
import {
  passwordSchema,
  passwordMatchSchema,
} from '@/app/(public)/(auth)/validation/auth-schema';

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema);

