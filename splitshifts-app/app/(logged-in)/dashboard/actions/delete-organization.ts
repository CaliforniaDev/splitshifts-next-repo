'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { eq, and, sql } from 'drizzle-orm';

import { organizations, organizationUsers } from '@/db/schema';
import {
  deleteOrganizationSchema,
  type DeleteOrganizationData,
} from '@/app/lib/validation';

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
  // SECURITY LAYER 1: Authentication Check
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  try {
    // SECURITY LAYER 2: Data Validation
    const validatedData = deleteOrganizationSchema.parse(organizationId);

    // SECURITY LAYER 3: Authorization Check
    // Verify user is an admin of this organization
    const [userOrgRelation] = await db
      .select({ exists: sql`1` })
      .from(organizationUsers)
      .where(
        and(
          eq(organizationUsers.userId, session.user.id),
          eq(organizationUsers.orgId, validatedData.id),
          eq(organizationUsers.role, 'admin'),
          eq(organizationUsers.isActive, true),
        ),
      )
      .limit(1);

    if (!userOrgRelation) {
      return {
        success: false,
        error: 'You are not authorized to delete this organization',
      };
    }

    // SECURITY LAYER 4: Deletion Guard
    // Check if organization exists and is not already deleted
    const [existingOrg] = await db
      .select({ 
        deletedAt: organizations.deletedAt,
      })
      .from(organizations)
      .where(eq(organizations.id, validatedData.id))
      .limit(1);

    if (!existingOrg) {
      return {
        success: false,
        error: 'Organization not found',
      };
    }

    if (existingOrg.deletedAt) {
      return {
        success: false,
        error: 'Cannot delete an organization that is already deleted',
      };
    }

    // SECURITY LAYER 5: Soft Delete Operation
    // Set deletedAt timestamp instead of permanently deleting the record
    const now = new Date();
    await db
      .update(organizations)
      .set({ deletedAt: now, updatedAt: now })
      .where(eq(organizations.id, validatedData.id));
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete organization. Please try again.',
    };
  }
}
