'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { employees } from '@/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';

/**
 * Server action to get all employees for the user's organization
 *
 * Retrieves all active (non-deleted) employees associated with the user's organization,
 * including their basic information and formatted full name.
 *
 * @returns Success status and array of employee records, or error message
 */
export async function getEmployees() {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Authorization
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found', employees: [] };
    }

    // 3. Database query with explicit column projection
    const employeesData = await db
      .select({
        id: employees.id,
        firstName: employees.firstName,
        lastName: employees.lastName,
        fullName: sql<string>`CONCAT(${employees.firstName}, ' ', ${employees.lastName})`,
        email: employees.email,
        phone: employees.phone,
        address: employees.address,
        hireDate: employees.hireDate,
        userId: employees.userId,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
      })
      .from(employees)
      .where(
        and(
          eq(employees.orgId, orgId),
          isNull(employees.deletedAt)
        )
      )
      .orderBy(employees.lastName, employees.firstName);

    return { success: true, employees: employeesData };
  } catch (error) {
    console.error('Failed to get employees:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, employees: [] };
    }
    return { success: false, error: 'Failed to get employees', employees: [] };
  }
}
