'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { shifts } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
  updateShiftSchema,
  type UpdateShiftFormData,
} from '@/app/lib/validation/shift';

export async function updateShift(data: UpdateShiftFormData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = updateShiftSchema.parse(data);

    // 3. Authorization - verify shift belongs to user's org
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found' };
    }

    // Check if shift exists and belongs to org
    const [existingShift] = await db
      .select({ id: shifts.id, status: shifts.status })
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

    // Prevent editing cancelled shifts
    if (existingShift.status === 'cancelled') {
      return { success: false, error: 'Cannot edit cancelled shifts' };
    }

    // 4. Database operation - build update object dynamically
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (validatedData.workSiteId) updateData.workSiteId = validatedData.workSiteId;
    if (validatedData.roleId) updateData.roleId = validatedData.roleId;
    if (validatedData.shiftStart) updateData.shiftStart = new Date(validatedData.shiftStart);
    if (validatedData.shiftEnd) updateData.shiftEnd = new Date(validatedData.shiftEnd);
    if (validatedData.hourlyRate !== undefined) updateData.hourlyRate = validatedData.hourlyRate || null;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
    if (validatedData.status) updateData.status = validatedData.status;
    if (validatedData.shiftGroupId !== undefined) updateData.shiftGroupId = validatedData.shiftGroupId || null;

    await db
      .update(shifts)
      .set(updateData)
      .where(eq(shifts.id, validatedData.id));

    return { success: true };
  } catch (error) {
    console.error('Failed to update shift:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update shift' };
  }
}
