'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { worksites } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';

/**
 * Server action to get all worksites for the user's organization
 *
 * Retrieves all active (non-deleted) worksites associated with the user's organization,
 * including their location, contact, and operational information.
 *
 * @returns Success status and array of worksite records, or error message
 */
export async function getWorksites() {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Authorization
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found', worksites: [] };
    }

    // 3. Database query with explicit column projection
    const worksitesData = await db
      .select({
        id: worksites.id,
        name: worksites.name,
        address: worksites.address,
        timezone: worksites.timezone,
        contactInfo: worksites.contactInfo,
        is247: worksites.is247,
        accessInstructions: worksites.accessInstructions,
        createdAt: worksites.createdAt,
        updatedAt: worksites.updatedAt,
      })
      .from(worksites)
      .where(
        and(
          eq(worksites.orgId, orgId),
          isNull(worksites.deletedAt)
        )
      )
      .orderBy(worksites.name);

    return { success: true, worksites: worksitesData };
  } catch (error) {
    console.error('Failed to get worksites:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message, worksites: [] };
    }
    return { success: false, error: 'Failed to get worksites', worksites: [] };
  }
}
