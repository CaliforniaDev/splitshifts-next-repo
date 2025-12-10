import { z } from 'zod';
import { ValidationPatterns } from '@/app/lib/utils/validation-patterns';

/**
 * Validation schemas for shift CRUD operations
 * Centralized location for shift-related Zod schemas
 */

// Constants
const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

// Helper to combine date and time strings into ISO datetime
const combineDateAndTime = (date: string, time: string): string => {
  return `${date}T${time}`;
};

// Destructure validation patterns for cleaner usage
const {
  date: dateValidation,
  time: timeValidation,
  hourlyRate: hourlyRateValidation,
} = ValidationPatterns;

// Shared shift fields used by create and update schemas
const shiftFieldsSchema = z.object({
  workSiteId: z.string().uuid('Invalid worksite ID format'),
  roleId: z.string().uuid('Invalid role ID format'),
  // Separate date and time fields for better UX
  startDate: z.string().regex(dateValidation.pattern, dateValidation.message),
  startTime: z.string().regex(timeValidation.pattern, timeValidation.message),
  endDate: z.string().regex(dateValidation.pattern, dateValidation.message),
  endTime: z.string().regex(timeValidation.pattern, timeValidation.message),
  hourlyRate: z
    .string()
    .refine(
      val => val === '' || hourlyRateValidation.pattern.test(val),
      hourlyRateValidation.message,
    )
    .optional(),
  notes: z
    .string()
    .refine(
      val => val === '' || val.length <= 1000,
      'Notes must be at most 1000 characters long',
    )
    .optional(),
  status: z
    .enum(['draft', 'published', 'cancelled'])
    .optional()
    .default('draft'),
  shiftGroupId: z
    .string()
    .refine(
      val =>
        val === '' ||
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          val,
        ),
      'Invalid shift group ID format',
    )
    .optional(),
});

// Schema for creating a new shift - adds validation refinements
export const createShiftSchema = shiftFieldsSchema
  .refine(
    data => {
      const start = new Date(
        combineDateAndTime(data.startDate, data.startTime),
      );
      const end = new Date(combineDateAndTime(data.endDate, data.endTime));
      return end > start;
    },
    {
      message: 'Shift end time must be after start time',
      path: ['endTime'],
    },
  )
  .refine(
    data => {
      const start = new Date(
        combineDateAndTime(data.startDate, data.startTime),
      );
      const now = new Date();
      // Allow creating shifts in the past for up to 7 days (for corrections)
      const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_IN_MS);
      return start >= sevenDaysAgo;
    },
    {
      message: 'Shift start time cannot be more than 7 days in the past',
      path: ['startDate'],
    },
  )
  .transform(data => ({
    ...data,
    // Combine separate fields into datetime strings for backend
    shiftStart: combineDateAndTime(data.startDate, data.startTime),
    shiftEnd: combineDateAndTime(data.endDate, data.endTime),
  }));

export type CreateShiftFormData = z.infer<typeof createShiftSchema>;

// Schema for updating a shift - makes all fields optional except ID
export const updateShiftSchema = shiftFieldsSchema
  .extend({
    id: z.string().uuid('Invalid shift ID format'),
  })
  .partial()
  .required({ id: true })
  .refine(
    data => {
      // Only validate if all date/time fields are being updated
      if (data.startDate && data.startTime && data.endDate && data.endTime) {
        const start = new Date(
          combineDateAndTime(data.startDate, data.startTime),
        );
        const end = new Date(combineDateAndTime(data.endDate, data.endTime));
        return end > start;
      }
      return true;
    },
    {
      message: 'Shift end time must be after start time',
      path: ['endTime'],
    },
  )
  .refine(
    data => {
      if (data.startDate && data.startTime) {
        const start = new Date(
          combineDateAndTime(data.startDate, data.startTime),
        );
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - SEVEN_DAYS_IN_MS);
        return start >= sevenDaysAgo;
      }
      return true;
    },
    {
      message: 'Shift start time cannot be more than 7 days in the past',
      path: ['startDate'],
    },
  )
  .transform(data => {
    const result: any = { ...data };

    // Combine separate fields into datetime strings if all parts are present
    if (data.startDate && data.startTime) {
      result.shiftStart = combineDateAndTime(data.startDate, data.startTime);
    }
    if (data.endDate && data.endTime) {
      result.shiftEnd = combineDateAndTime(data.endDate, data.endTime);
    }

    return result;
  });

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
  startDate: z
    .string()
    .datetime({ message: 'Invalid start date format' })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: 'Invalid end date format' })
    .optional(),
});

export type GetShiftsFilters = z.infer<typeof getShiftsSchema>;
