'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { roles } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Server action to get all roles for the user's organization
 *
 * Retrieves all active (non-deleted) roles associated with the user's organization.
 *
 * @returns Success status and array of role records, or error message
 */
export async function getRoles() {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Authorization
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found', roles: [] };
    }

    // 3. Database query with explicit column projection
    const rolesData = await db
      .select({
        id: roles.id,
        title: roles.title,
        description: roles.description,
        hourlyRate: roles.hourlyRate,
        requirements: roles.requirements,
        createdAt: roles.createdAt,
        updatedAt: roles.updatedAt,
      })
      .from(roles)
      .where(
        and(
          eq(roles.orgId, orgId),
          isNull(roles.deletedAt)
        )
      )
      .orderBy(roles.title);

    return { success: true, roles: rolesData };
  } catch (error) {
    console.error('Failed to get roles:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, roles: [] };
    }
    return { success: false, error: 'Failed to get roles', roles: [] };
  }
}
