'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { worksites, shifts } from '@/db/schema';
import { eq, and, isNull, count } from 'drizzle-orm';
import {
  deleteWorksiteSchema,
  type DeleteWorksiteData,
} from '@/app/lib/validation/worksite';

/**
 * Server action to delete (soft delete) a worksite
 *
 * Performs a soft delete by setting the deletedAt timestamp.
 * Validates that no active shifts are associated with the worksite before deletion.
 * Verifies that the worksite belongs to the user's organization.
 *
 * @param data - Object containing worksite ID to delete
 * @returns Success status or error message
 */
export async function deleteWorksite(data: DeleteWorksiteData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = deleteWorksiteSchema.parse(data);

    // 3. Authorization - verify worksite belongs to user's org
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found' };
    }

    // Check if worksite exists and belongs to org
    const [existingWorksite] = await db
      .select({ id: worksites.id })
      .from(worksites)
      .where(
        and(
          eq(worksites.id, validatedData.id),
          eq(worksites.orgId, orgId),
          isNull(worksites.deletedAt)
        )
      );

    if (!existingWorksite) {
      return { success: false, error: 'Worksite not found' };
    }

    // 4. Validation - check for active shifts
    const [shiftCount] = await db
      .select({ count: count() })
      .from(shifts)
      .where(
        and(
          eq(shifts.workSiteId, validatedData.id),
          isNull(shifts.deletedAt)
        )
      );

    if (shiftCount.count > 0) {
      return {
        success: false,
        error: `Cannot delete worksite. There are ${shiftCount.count} active shift(s) associated with this location. Please remove or reassign shifts first.`,
      };
    }

    // 5. Database operation - soft delete
    await db
      .update(worksites)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(worksites.id, validatedData.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to delete worksite:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to delete worksite' };
  }
}
