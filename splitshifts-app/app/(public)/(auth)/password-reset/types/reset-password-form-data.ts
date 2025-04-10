import { z } from 'zod';
import { resetPasswordSchema } from '@/app/(public)/(auth)/validation/auth-schema';

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;