import { z } from 'zod';

export const nameSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    // Ensure name is at least 2 characters long
    if (value.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 2,
        type: 'string',
        inclusive: true,
        message: 'Name must be at least 2 characters long',
      });
      return; // Stop further validation
    }

    // Ensure name is no longer than 50 characters
    if (value.length > 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 50,
        type: 'string',
        inclusive: true,
        message: 'Name cannot be longer than 50 characters',
      });
      return; // Stop further validation
    }

    // Ensure name contains only valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Only letters, spaces, hyphens, and apostrophes are allowed',
      });
    }
  });
