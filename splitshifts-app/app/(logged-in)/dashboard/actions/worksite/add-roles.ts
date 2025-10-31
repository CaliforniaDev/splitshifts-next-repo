'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { v7 as uuidv7 } from 'uuid';

import { roles } from '@/db/schema';
import {
  createRolesSchema,
  type CreateRolesFormData,
} from '@/app/lib/validation/roles';

/**
 * Server action to create a new role for the user's organization
 *
 * Creates a job role/position with title, description, hourly rate, and requirements.
 * Automatically associates the role with the user's organization from session data.
 *
 * @param data - Role data including title, description, hourly rate, and requirements
 * @returns Success status and created role ID, or error message
 */
export async function addRoles(data: CreateRolesFormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }
  const orgId = session.user.orgId;
  if (!orgId) {
    return { success: false, error: 'Organization not found' };
  }

  try {
    const validatedData = createRolesSchema.parse(data);

    const roleId = uuidv7();
    await db.insert(roles).values({
      id: roleId,
      orgId: orgId,
      title: validatedData.title,
      description: validatedData.description || null,
      hourlyRate: validatedData.hourlyRate
        ? validatedData.hourlyRate.toString()
        : null,
      requirements: validatedData.requirements || null,
    });
    return { success: true, roleId };
  } catch (error) {
    console.error('Failed to add role:', error);
    return { success: false, error: 'Failed to add role' };
  }
}
