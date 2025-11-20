import { z } from 'zod';
import { ValidationPatterns } from '@/app/lib/utils/validation-patterns';

/**
 * Validation schemas for employee CRUD operations
 * Centralized location for employee-related Zod schemas
 */

// Schema for creating a new employee
export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters long')
    .max(100, 'First name must be at most 100 characters long')
    .regex(ValidationPatterns.name.pattern, ValidationPatterns.name.message),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(100, 'Last name must be at most 100 characters long')
    .regex(ValidationPatterns.name.pattern, ValidationPatterns.name.message),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(30, 'Phone number must be at most 30 characters long')
    .regex(ValidationPatterns.phone.pattern, ValidationPatterns.phone.message)
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Address must be at most 200 characters long')
    .optional()
    .or(z.literal('')),
  hireDate: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

// Schema for updating an employee - extends create schema with ID
export const updateEmployeeSchema = createEmployeeSchema.extend({
  id: z.string().uuid('Invalid employee ID format'),
});

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

// Schema for deleting an employee - only requires ID
export const deleteEmployeeSchema = z.object({
  id: z.string().uuid('Invalid employee ID format'),
});

export type DeleteEmployeeData = z.infer<typeof deleteEmployeeSchema>;
