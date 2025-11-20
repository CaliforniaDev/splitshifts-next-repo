import { z } from 'zod';

/**
 * Validation schemas for shift CRUD operations
 * Centralized location for shift-related Zod schemas
 */

// Schema for creating a new shift
export const createShiftSchema = z.object({
  workSiteId: z.string().uuid('Invalid worksite ID format'),
  roleId: z.string().uuid('Invalid role ID format'),
  shiftStart: z.string().datetime('Invalid start date/time format'),
  shiftEnd: z.string().datetime('Invalid end date/time format'),
  hourlyRate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Hourly rate must be a valid number with up to 2 decimal places')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters long')
    .optional()
    .or(z.literal('')),
  status: z.enum(['draft', 'published', 'cancelled']).optional().default('draft'),
  shiftGroupId: z
    .string()
    .uuid('Invalid shift group ID format')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    const start = new Date(data.shiftStart);
    const end = new Date(data.shiftEnd);
    return end > start;
  },
  {
    message: 'Shift end time must be after start time',
    path: ['shiftEnd'],
  }
).refine(
  (data) => {
    const start = new Date(data.shiftStart);
    const now = new Date();
    // Allow creating shifts in the past for up to 7 days (for corrections)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return start >= sevenDaysAgo;
  },
  {
    message: 'Shift start time cannot be more than 7 days in the past',
    path: ['shiftStart'],
  }
);

export type CreateShiftFormData = z.infer<typeof createShiftSchema>;

// Base schema without refinements for update
const baseShiftSchema = z.object({
  workSiteId: z.string().uuid('Invalid worksite ID format'),
  roleId: z.string().uuid('Invalid role ID format'),
  shiftStart: z.string().datetime('Invalid start date/time format'),
  shiftEnd: z.string().datetime('Invalid end date/time format'),
  hourlyRate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Hourly rate must be a valid number with up to 2 decimal places')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(1000, 'Notes must be at most 1000 characters long')
    .optional()
    .or(z.literal('')),
  status: z.enum(['draft', 'published', 'cancelled']).optional().default('draft'),
  shiftGroupId: z
    .string()
    .uuid('Invalid shift group ID format')
    .optional()
    .or(z.literal('')),
});

// Schema for updating a shift - extends base schema with ID
export const updateShiftSchema = baseShiftSchema.extend({
  id: z.string().uuid('Invalid shift ID format'),
}).partial().required({ id: true });

export type UpdateShiftFormData = z.infer<typeof updateShiftSchema>;

// Schema for deleting a shift - only requires ID
export const deleteShiftSchema = z.object({
  id: z.string().uuid('Invalid shift ID format'),
});

export type DeleteShiftData = z.infer<typeof deleteShiftSchema>;

// Schema for getting shifts with optional filters
export const getShiftsSchema = z.object({
  workSiteId: z.string().uuid('Invalid worksite ID format').optional(),
  roleId: z.string().uuid('Invalid role ID format').optional(),
  employeeId: z.string().uuid('Invalid employee ID format').optional(),
  status: z.enum(['draft', 'published', 'cancelled']).optional(),
  startDate: z.string().datetime('Invalid start date format').optional(),
  endDate: z.string().datetime('Invalid end date format').optional(),
});

export type GetShiftsFilters = z.infer<typeof getShiftsSchema>;
