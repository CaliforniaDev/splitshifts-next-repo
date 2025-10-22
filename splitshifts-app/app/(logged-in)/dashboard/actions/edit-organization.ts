'use server';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { eq, and } from 'drizzle-orm';

import { organizations, organizationUsers } from '@/db/schema';
import {
  updateOrganizationSchema,
  type UpdateOrganizationFormData,
} from '@/app/lib/validation/organization';

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
  // SECURITY LAYER 1: Authentication Check
  // Verify user is logged in, redirect to logout if not
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  try {
    // SECURITY LAYER 2: Data Validation
    // Parse and validate all input data using Zod schema
    // This prevents malformed data from reaching the database
    const validatedData = updateOrganizationSchema.parse(data);

    // SECURITY LAYER 3: Authorization Check
    // Verify this user is an admin of the specific organization they're trying to edit
    // This prevents users from editing organizations they don't belong to
    const [userOrgRelation] = await db
      .select({
        role: organizationUsers.role,
        isActive: organizationUsers.isActive,
      })
      .from(organizationUsers)
      .where(
        and(
          eq(organizationUsers.userId, session.user.id),
          eq(organizationUsers.orgId, validatedData.id),
          eq(organizationUsers.role, 'admin'),
          eq(organizationUsers.isActive, true),
        ),
      );
    
    if (!userOrgRelation) {
      return {
        success: false,
        error: 'You are not authorized to edit this organization',
      };
    }

    // SECURITY LAYER 4: Deletion Guard
    // Prevent editing organizations that have been soft-deleted
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
        error: 'Cannot edit a deleted organization',
      };
    }

    // SECURITY LAYER 5: Database Update Operation
    // Update the organization with new data and audit timestamp
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
