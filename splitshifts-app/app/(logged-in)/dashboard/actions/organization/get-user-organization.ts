'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import db from '@/db/drizzle';
import { eq, and, isNull } from 'drizzle-orm';
import { organizations, organizationUsers } from '@/db/schema';

/**
 * Get the current user's organization if they have one
 * Returns null if no organization exists
 */
export async function getUserOrganization() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  try {
    const [userOrg] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        description: organizations.description,
        weekStartDay: organizations.weekStartDay,
      })
      .from(organizationUsers)
      .innerJoin(organizations, eq(organizationUsers.orgId, organizations.id))
      .where(
        and(
          eq(organizationUsers.userId, session.user.id),
          isNull(organizations.deletedAt) // Only active organizations
        )
      )
      .limit(1);

    if (!userOrg) {
      return { success: true, organization: null };
    }

    return {
      success: true,
      organization: {
        id: userOrg.id,
        name: userOrg.name,
        description: userOrg.description,
        weekStartDay: userOrg.weekStartDay as 'monday' | 'sunday',
      },
    };
  } catch (error) {
    console.error('Failed to fetch organization:', error);
    return { success: false, error: 'Failed to fetch organization' };
  }
}
