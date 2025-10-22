'use server';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { v7 as uuidv7 } from 'uuid';


import { worksites } from '@/db/schema';
import { createWorksiteSchema, type CreateWorksiteFormData } from '@/app/lib/validation';

/**
 * Server action to create a new worksite for the user's organization
 *
 * Automatically associates the worksite with the user's organization
 * from their session data (orgId). Used during onboarding workflow.
 *
 * @param data - Worksite data including name, address, timezone, etc.
 * @returns Success status and created worksite ID
 */
export async function addWorksite(data: CreateWorksiteFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  const orgId = session.user.orgId;
  if (!orgId) {
    return { success: false, error: 'Organization not found' };
  }

  try {
    const validatedData = createWorksiteSchema.parse(data);

    const worksiteId = uuidv7();
    await db.insert(worksites).values({
      id: worksiteId,
      orgId: orgId,
      name: validatedData.name,
      address: validatedData.address,
      timezone: validatedData.timezone,
      contactInfo: validatedData.contactInfo,
      is247: validatedData.is247,
      accessInstructions: validatedData.accessInstructions,
    });

    return { success: true, worksiteId };
  } catch (error) {
    console.error('Failed to create worksite:', error);
    return { success: false, error: 'Failed to create worksite' };
  }
}
