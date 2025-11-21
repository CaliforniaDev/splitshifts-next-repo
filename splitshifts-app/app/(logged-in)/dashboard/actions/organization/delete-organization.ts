'use server';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { organizations, worksites, roles, employees, shifts } from '@/db/schema';
import {
  deleteOrganizationSchema,
  type DeleteOrganizationData,
} from '@/app/lib/validation';
import { authorizeOrganizationAction } from './organization-auth-utils';

/**
 * Server action to soft-delete an organization
 *
 * Implements soft delete pattern by setting deletedAt timestamp instead of
 * permanently removing the record. This preserves data integrity and audit trails.
 *
 * Security layers:
 * 1. Authentication check - user must be logged in
 * 2. Data validation - input must pass Zod schema validation
 * 3. Authorization check - user must be admin of THIS specific organization
 * 4. Deletion guard - prevent deleting already deleted organizations
 * 5. Soft delete with audit trail (deletedAt and updatedAt timestamps)
 */
export async function deleteOrganization(
  organizationId: DeleteOrganizationData,
) {
  try {
    // SECURITY LAYER 1 & 2: Validate input data
    const validatedData = deleteOrganizationSchema.parse(organizationId);

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
        error: 'Cannot delete an organization that is already deleted',
      };
    }

    // Cascade Soft Delete Operation
    // Delete all related data in a transaction to ensure atomicity
    const now = new Date();
    
    await db.transaction(async (tx) => {
      // Order matters: delete dependent data first
      await tx
        .update(shifts)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(shifts.orgId, validatedData.id));
      
      await tx
        .update(employees)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(employees.orgId, validatedData.id));
      
      await tx
        .update(roles)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(roles.orgId, validatedData.id));
      
      await tx
        .update(worksites)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(worksites.orgId, validatedData.id));
      
      await tx
        .update(organizations)
        .set({ deletedAt: now, updatedAt: now })
        .where(eq(organizations.id, validatedData.id));
    });

    return { success: true };
  } catch (error) {
    console.error('Delete organization error:', error);
    return {
      success: false,
      error: 'Failed to delete organization. Please try again.',
    };
  }
}
