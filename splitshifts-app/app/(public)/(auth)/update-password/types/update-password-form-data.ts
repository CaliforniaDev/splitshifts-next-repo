import { z } from 'zod';
import { passwordMatchSchema } from '../../validation/auth-schema';

// This type is used to strongly type the form data inside useForm<>() hook
export type UpdatePasswordData = z.infer<typeof passwordMatchSchema>;

export type UpdatePasswordResponse = {
  searchParams: { token?: string };
};
