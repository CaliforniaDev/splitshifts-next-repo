'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/db/drizzle';
import { eq, and, sql } from 'drizzle-orm';
import { organizations, organizationUsers } from '@/db/schema';

/**
 * Shared authorization utilities for organization actions
 * Reduces code duplication across create, edit, delete operations
 */

/**
 * Verify user is authenticated and return session
 * Redirects to signout if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }
  
  return session;
}

/**
 * Verify user is an admin of the specified organization
 * 
 * @param userId - The user's ID from session
 * @param organizationId - The organization ID to check
 * @returns boolean - true if user is admin, false otherwise
 */
export async function isOrganizationAdmin(
  userId: string,
  organizationId: string,
): Promise<boolean> {
  const [userOrgRelation] = await db
    .select({ exists: sql`1` })
    .from(organizationUsers)
    .where(
      and(
        eq(organizationUsers.userId, userId),
        eq(organizationUsers.orgId, organizationId),
        eq(organizationUsers.role, 'admin'),
        eq(organizationUsers.isActive, true),
      ),
    )
    .limit(1);

  return !!userOrgRelation;
}

/**
 * Check if organization exists and is not deleted
 * 
 * @param organizationId - The organization ID to check
 * @returns object with exists and deletedAt status
 */
export async function getOrganizationStatus(organizationId: string) {
  const [org] = await db
    .select({
      id: organizations.id,
      deletedAt: organizations.deletedAt,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  return {
    exists: !!org,
    isDeleted: !!org?.deletedAt,
    organization: org,
  };
}

/**
 * Combined authorization check for organization actions
 * Checks authentication, admin status, and organization existence
 * 
 * @param organizationId - The organization ID to check
 * @returns Result object with success status and optional error message
 */
export async function authorizeOrganizationAction(organizationId: string) {
  // Check authentication
  const session = await requireAuth();
  
  // Check if user is admin
  const isAdmin = await isOrganizationAdmin(session.user.id!, organizationId);
  
  if (!isAdmin) {
    return {
      success: false,
      error: 'You are not authorized to perform this action',
    };
  }
  
  // Check organization exists
  const status = await getOrganizationStatus(organizationId);
  
  if (!status.exists) {
    return {
      success: false,
      error: 'Organization not found',
    };
  }
  
  return {
    success: true,
    session,
    organizationStatus: status,
  };
}
