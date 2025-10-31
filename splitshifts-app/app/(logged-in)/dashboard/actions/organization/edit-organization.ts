'use server';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { organizations } from '@/db/schema';
import {
  updateOrganizationSchema,
  type UpdateOrganizationFormData,
} from '@/app/lib/validation/organization';
import { authorizeOrganizationAction } from './organization-auth-utils';

/**
 * Server action to edit/update an existing organization
 *
 * Security layers:
 * 1. Authentication check - user must be logged in
 * 2. Data validation - input must pass Zod schema validation
 * 3. Authorization check - user must be admin of THIS specific organization
 * 4. Deletion guard - prevent editing deleted organizations
 * 5. Database update with audit trail (updatedAt timestamp)
 */
export async function editOrganization(data: UpdateOrganizationFormData) {
  try {
    // SECURITY LAYER 1 & 2: Validate input data
    const validatedData = updateOrganizationSchema.parse(data);

    // SECURITY LAYER 3 & 4: Combined authorization and existence check
    const authResult = await authorizeOrganizationAction(validatedData.id);
    
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    // SECURITY LAYER 5: Deletion Guard
    if (authResult.organizationStatus?.isDeleted) {
      return {
        success: false,
        error: 'Cannot edit a deleted organization',
      };
    }

    // Database Update Operation
    await db
      .update(organizations)
      .set({
        name: validatedData.name,
        description: validatedData.description,
        weekStartDay: validatedData.weekStartDay,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, validatedData.id));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to update organization:', error);
    return {
      success: false,
      error: 'Failed to update organization. Please try again.',
    };
  }
}
