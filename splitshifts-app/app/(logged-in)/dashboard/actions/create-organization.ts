'use server';

import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { auth } from '@/auth';
import { v7 as uuidv7 } from 'uuid';

import { organizations, organizationUsers } from '@/db/schema';
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from '@/app/lib/validation/organization';

export async function createOrganization(data: CreateOrganizationFormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  try {
    // Validate data
    const validatedData = createOrganizationSchema.parse(data);

    // Create organization with UUIDv7
    const organizationId = uuidv7();

    await db.insert(organizations).values({
      id: organizationId,
      name: validatedData.name,
      description: validatedData.description,
      weekStartDay: validatedData.weekStartDay,
      settings: {}, // Default settings
    });

    await db.insert(organizationUsers).values({
      id: uuidv7(),
      orgId: organizationId,
      userId: session.user.id,
      role: 'admin', // First user is admin
      isActive: true,
    });
    return { success: true, organizationId };
  } catch (error) {
    console.error('Failed to create organization:', error);
    return { success: false, error: 'Failed to create organization' };
  }
}
