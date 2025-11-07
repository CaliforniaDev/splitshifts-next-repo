// File: app/lib/auth-utils.ts

'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema/usersSchema';

/**
 * Validates that the current session exists and the user still exists in the database.
 * Redirects to signout if session is invalid or user has been deleted.
 * 
 * @returns The validated session with user ID
 * @throws Redirects to /api/auth/signout if validation fails
 */
export async function validateUserSession() {
  const session = await auth();

  // Check if session exists
  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  // Verify user still exists in database (users table has no soft-delete)
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, session.user.id));

  // If user doesn't exist, their account was deleted - force logout
  if (!user) {
    redirect('/api/auth/signout');
  }

  return session;
}

/**
 * Gets the current session without database validation.
 * Use this for layouts that need fast JWT-only validation.
 * 
 * @returns The current session or redirects to signout
 */
export async function requireSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  return session;
}

/**
 * Verifies user is authenticated and returns session.
 * Use this in server actions for authentication checks.
 * Redirects to signout if not authenticated.
 * 
 * @returns The current session or redirects to signout
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  return session;
}
