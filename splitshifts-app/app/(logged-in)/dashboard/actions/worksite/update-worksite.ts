'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { worksites } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
  updateWorksiteSchema,
  type UpdateWorksiteFormData,
} from '@/app/lib/validation/worksite';

/**
 * Server action to update an existing worksite
 *
 * Updates worksite information including name, address, timezone, contact info,
 * and operational details. Verifies that the worksite belongs to the user's organization.
 *
 * @param data - Worksite data including id and fields to update
 * @returns Success status or error message
 */
export async function updateWorksite(data: UpdateWorksiteFormData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = updateWorksiteSchema.parse(data);

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

    // 4. Database operation
    await db
      .update(worksites)
      .set({
        name: validatedData.name,
        address: validatedData.address,
        timezone: validatedData.timezone,
        contactInfo: validatedData.contactInfo,
        is247: validatedData.is247,
        accessInstructions: validatedData.accessInstructions,
        updatedAt: new Date(),
      })
      .where(eq(worksites.id, validatedData.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to update worksite:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update worksite' };
  }
}
