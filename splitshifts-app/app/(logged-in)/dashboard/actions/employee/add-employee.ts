'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { v7 as uuidv7 } from 'uuid';

import { employees } from '@/db/schema';
import {
  createEmployeeSchema,
  type CreateEmployeeFormData,
} from '@/app/lib/validation/employee';

/**
 * Server action to create a new employee for the user's organization
 *
 * Creates an employee record with basic information including name, contact details,
 * address, and hire date. Automatically associates the employee with the user's
 * organization from session data.
 *
 * @param data - Employee data including firstName, lastName, email, phone, address, and hireDate
 * @returns Success status and created employee ID, or error message
 */
export async function addEmployee(data: CreateEmployeeFormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }
  const orgId = session.user.orgId;
  if (!orgId) {
    return { success: false, error: 'Organization not found' };
  }

  try {
    const validatedData = createEmployeeSchema.parse(data);

    const employeeId = uuidv7();
    await db.insert(employees).values({
      id: employeeId,
      orgId: orgId,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      hireDate: validatedData.hireDate || null,
    });
    return { success: true, employeeId };
  } catch (error) {
    console.error('Failed to add employee:', error);
    return { success: false, error: 'Failed to add employee' };
  }
}
