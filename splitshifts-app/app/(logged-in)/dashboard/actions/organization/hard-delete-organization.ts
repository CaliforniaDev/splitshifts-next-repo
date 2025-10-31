'use server';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { organizations } from '@/db/schema';
import {
  deleteOrganizationSchema,
  type DeleteOrganizationData,
} from '@/app/lib/validation';
import { authorizeOrganizationAction } from './organization-auth-utils';

/**
 * Server action to HARD DELETE an organization (onboarding only)
 * 
 * USE ONLY FOR INCOMPLETE ONBOARDING - permanently removes organization
 * For production organizations, use deleteOrganization (soft delete) instead.
 * 
 * This should only be called when:
 * - User is in onboarding flow
 * - Organization has no employees, shifts, or other business data
 * - User is canceling setup before completion
 */
export async function hardDeleteOrganization(
  organizationId: DeleteOrganizationData,
) {
  try {
    // Validate input data
    const validatedData = deleteOrganizationSchema.parse(organizationId);

    // Authorization check - user must be admin
    const authResult = await authorizeOrganizationAction(validatedData.id);
    
    if (!authResult.success) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    // HARD DELETE - Permanently remove the organization
    // Database CASCADE will handle related organizationUsers records
    await db
      .delete(organizations)
      .where(eq(organizations.id, validatedData.id));
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete organization. Please try again.',
    };
  }
}
