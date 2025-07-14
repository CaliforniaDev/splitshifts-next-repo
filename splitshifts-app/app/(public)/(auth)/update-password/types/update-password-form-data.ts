import { z } from 'zod';
// import { useUpdatePasswordForm } from '../hooks/use-update-password-form';
// import { updatePasswordSchema } from '../validation/update-password-schema';
import { passwordMatchSchema } from '../../validation/auth-schema';

// This type is used to strongly type the form data inside useForm<>() hook
export type UpdatePasswordData = z.infer<typeof passwordMatchSchema>;

export type UpdatePasswordResponse = {
  searchParams: { token?: string };
};
