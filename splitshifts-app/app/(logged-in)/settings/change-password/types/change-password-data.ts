import { z } from 'zod';

import { changePasswordSchema } from '../validation/change-password-schema';

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export type ChangePasswordResponse = {
  error: boolean;
  message?: string;
};
