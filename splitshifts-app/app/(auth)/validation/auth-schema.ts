import { z } from 'zod';

// 👤 First & Last Name Validation
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

// 🔐 Password Validation
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

// 🔄 Password Confirmation Schema
export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
      });
    }
  });

// 📝 Sign Up Form Schema
export const signUpFormSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: z.string().email('Invalid email address'),
  })
  .and(passwordMatchSchema);

// Log In Form Schema
export const logInFormSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
