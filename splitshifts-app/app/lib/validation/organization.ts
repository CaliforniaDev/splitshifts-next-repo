import {z} from 'zod';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters long')
    .max(100, 'Organization name must be at most 100 characters long'),
  description: z
    .string()
    .max(500, 'Organization description must be at most 500 characters long')
    .optional(),
  weekStartDay: z.enum(['monday', 'sunday']).optional().default('monday'),
});

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;