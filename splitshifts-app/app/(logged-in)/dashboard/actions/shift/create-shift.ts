'use server';

import { requireAuth } from '@/app/lib/auth-utils';
import db from '@/db/drizzle';
import { v7 as uuidv7 } from 'uuid';
import { shifts } from '@/db/schema';
import {
  createShiftSchema,
  type CreateShiftFormData,
} from '@/app/lib/validation/shift';

export async function createShift(data: CreateShiftFormData) {
  // 1. Authentication
  const session = await requireAuth();

  try {
    // 2. Validation
    const validatedData = createShiftSchema.parse(data);

    // 3. Authorization - verify org exists
    const orgId = session.user.orgId;
    if (!orgId) {
      return { success: false, error: 'No organization found' };
    }

    // 4. Database operation
    const shiftId = uuidv7();

    await db.insert(shifts).values({
      id: shiftId,
      orgId,
      workSiteId: validatedData.workSiteId,
      roleId: validatedData.roleId,
      shiftStart: new Date(validatedData.shiftStart),
      shiftEnd: new Date(validatedData.shiftEnd),
      hourlyRate: validatedData.hourlyRate || null,
      notes: validatedData.notes || null,
      status: validatedData.status || 'draft',
      shiftGroupId: validatedData.shiftGroupId || null,
    });

    return { success: true, shiftId };
  } catch (error) {
    console.error('Failed to create shift:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create shift' };
  }
}
