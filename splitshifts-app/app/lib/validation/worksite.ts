import { z } from 'zod';
import { TIMEZONE_VALUES, DEFAULT_TIMEZONE } from '@/app/lib/utils/timezones';
import { ValidationPatterns } from '@/app/lib/utils/validation-patterns';

export const createWorksiteSchema = z.object({
  name: z
    .string()
    .min(2, 'Worksite name must be at least 2 characters long')
    .max(150, 'Worksite name must be at most 100 characters long')
    .regex(
      ValidationPatterns.worksiteName.pattern,
      ValidationPatterns.worksiteName.message,
    ),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters long')
    .max(200, 'Address must be at most 200 characters long')
    .regex(
      ValidationPatterns.address.pattern,
      ValidationPatterns.address.message,
    ),
  timezone: z
    .enum(TIMEZONE_VALUES, {
      errorMap: () => ({ message: 'Please select a valid timezone' }),
    })
    .default(DEFAULT_TIMEZONE),

  // Contact Information (jsonb field)
  contactInfo: z
    .object({
      primaryContact: z
        .string()
        .max(150, 'Primary contact must be at most 150 characters long')
        .optional(),
      phone: z
        .string()
        .max(30, 'Phone number must be at most 30 characters long')
        .regex(
          ValidationPatterns.phone.pattern,
          ValidationPatterns.phone.message,
        )
        .optional(),
      email: z.string().email('Invalid email address').optional(),
      emergencyContact: z
        .string()
        .max(150, 'Emergency contact must be at most 150 characters long')
        .optional(),
      emergencyPhone: z
        .string()
        .max(30, 'Emergency phone number must be at most 30 characters long')
        .regex(
          ValidationPatterns.phone.pattern,
          ValidationPatterns.phone.message,
        )
        .optional(),
    })
    .optional(),

  // 24/7 Operation Flag
  is247: z.boolean().default(false),

  // Access Instructions (jsonb field)
  accessInstructions: z
    .object({
      keyLocation: z
        .string()
        .max(500, 'Key location description is too long')
        .optional(),
      accessCodes: z
        .string()
        .max(500, 'Access codes description is too long')
        .optional(),
      specialInstructions: z
        .string()
        .max(1000, 'Special instructions are too long')
        .optional(),
      contactRequired: z.boolean().optional(),
    })
    .optional(),
});

export type CreateWorksiteFormData = z.infer<typeof createWorksiteSchema>;

// Schema for updating a worksite - extends create schema with ID
export const updateWorksiteSchema = createWorksiteSchema.extend({
  id: z.string().uuid('Invalid worksite ID format'),
});

export type UpdateWorksiteFormData = z.infer<typeof updateWorksiteSchema>;

// Schema for deleting a worksite - only requires ID
export const deleteWorksiteSchema = z.object({
  id: z.string().uuid('Invalid worksite ID format'),
});

export type DeleteWorksiteData = z.infer<typeof deleteWorksiteSchema>;
