'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { shifts } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
  deleteShiftSchema,
  type DeleteShiftData,
} from '@/app/lib/validation/shift';

export async function deleteShift(data: DeleteShiftData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = deleteShiftSchema.parse(data);

    // 3. Authorization - verify shift belongs to user's org
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found' };
    }

    // Check if shift exists and belongs to org
    const [existingShift] = await db
      .select({ id: shifts.id })
      .from(shifts)
      .where(
        and(
          eq(shifts.id, validatedData.id),
          eq(shifts.orgId, orgId),
          isNull(shifts.deletedAt)
        )
      );

    if (!existingShift) {
      return { success: false, error: 'Shift not found' };
    }

    // 4. Database operation - soft delete
    await db
      .update(shifts)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(shifts.id, validatedData.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to delete shift:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to delete shift' };
  }
}
