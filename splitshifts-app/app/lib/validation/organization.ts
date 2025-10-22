import { z } from 'zod';

/**
 * Validation schemas for organization CRUD operations
 * Centralized location for organization-related Zod schemas
 */

// Schema for creating a new organization
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

// Schema for updating an organization - extends create schema with ID
export const updateOrganizationSchema = createOrganizationSchema.extend({
  id: z.string().uuid('Invalid organization ID format'),
});
export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;

// Schema for deleting an organization - only requires ID
export const deleteOrganizationSchema = z.object({
  id: z.string().uuid('Invalid organization ID format'),
});
export type DeleteOrganizationData = z.infer<typeof deleteOrganizationSchema>;