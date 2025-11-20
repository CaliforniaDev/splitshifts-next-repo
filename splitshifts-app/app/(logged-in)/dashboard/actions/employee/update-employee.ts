'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { employees } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
  updateEmployeeSchema,
  type UpdateEmployeeFormData,
} from '@/app/lib/validation/employee';

/**
 * Server action to update an existing employee
 *
 * Updates employee information including name, contact details, address, and hire date.
 * Verifies that the employee belongs to the user's organization before updating.
 *
 * @param data - Employee data including id and fields to update
 * @returns Success status or error message
 */
export async function updateEmployee(data: UpdateEmployeeFormData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = updateEmployeeSchema.parse(data);

    // 3. Authorization - verify employee belongs to user's org
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found' };
    }

    // Check if employee exists and belongs to org
    const [existingEmployee] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(
        and(
          eq(employees.id, validatedData.id),
          eq(employees.orgId, orgId),
          isNull(employees.deletedAt)
        )
      );

    if (!existingEmployee) {
      return { success: false, error: 'Employee not found' };
    }

    // 4. Database operation
    await db
      .update(employees)
      .set({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        hireDate: validatedData.hireDate || null,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, validatedData.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to update employee:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update employee' };
  }
}
