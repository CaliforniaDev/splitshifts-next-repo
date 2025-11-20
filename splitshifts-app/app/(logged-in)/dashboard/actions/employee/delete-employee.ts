'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { employees } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
  deleteEmployeeSchema,
  type DeleteEmployeeData,
} from '@/app/lib/validation/employee';

/**
 * Server action to delete (soft delete) an employee
 *
 * Performs a soft delete by setting the deletedAt timestamp.
 * Verifies that the employee belongs to the user's organization before deletion.
 *
 * @param data - Object containing employee ID to delete
 * @returns Success status or error message
 */
export async function deleteEmployee(data: DeleteEmployeeData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = deleteEmployeeSchema.parse(data);

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

    // 4. Database operation - soft delete
    await db
      .update(employees)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(employees.id, validatedData.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to delete employee:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to delete employee' };
  }
}
