import { z } from 'zod';

export const createRolesSchema = z.object({
  title: z
    .string()
    .min(2, 'Role title must be at least 2 characters long')
    .max(100, 'Role title must be at most 100 characters long'),
  description: z
    .string()
    .max(500, 'Role description must be at most 500 characters long')
    .optional(),
  hourlyRate: z
    .number()
    .min(0, 'Hourly rate must be a positive number')
    .optional(),
  requirements: z
    .object({
      minimumAge: z
        .number()
        .min(14, 'Minimum age must be at least 14')
        .optional(),
      requiredCertifications: z
        .array(
          z
            .string()
            .max(100, 'Certification must be at most 100 characters long'),
        )
        .optional(),
      physicalRequirements: z
        .array(
          z
            .string()
            .max(
              100,
              'Physical requirement must be at most 100 characters long',
            ),
        )
        .optional(),
      equipmentProvided: z
        .array(
          z.string().max(100, 'Equipment must be at most 100 characters long'),
        )
        .optional(),
      specialSkills: z
        .array(
          z
            .string()
            .max(100, 'Special skill must be at most 100 characters long'),
        )
        .optional(),
    })
    .optional(),
});

export type CreateRolesFormData = z.infer<typeof createRolesSchema>;