import { z } from 'zod';

export const passwordSchema = z.string().superRefine((value, ctx) => {
  const hasMinLength = value.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  if (!hasMinLength && !hasSpecialChar) {
    // If both are missing, add just the combined error
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'Password must be at least 8 characters and contain at least one special character',
    });
  } else {
    // Otherwise, add only the specific failures
    if (!hasMinLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 8 characters',
      });
    }

    if (!hasSpecialChar) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one special character',
      });
    }
  }
});
