import { z } from 'zod';
import { passwordResetSchema } from '@/app/(public)/(auth)/validation/auth-schema';

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;