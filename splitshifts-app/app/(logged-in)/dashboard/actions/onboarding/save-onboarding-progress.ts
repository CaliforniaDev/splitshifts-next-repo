'use server';

import { eq } from 'drizzle-orm';
import db from '@/db/drizzle';
import { users } from '@/db/schema';
import { requireAuth } from '@/app/lib/auth-utils';
import { OnboardingStep } from '../../components/onboarding';

/**
 * Save user's current onboarding step to database
 * Allows resuming onboarding after page refresh
 * 
 * @param step - Current onboarding step to save (null clears progress)
 * @returns Success status
 */
export async function saveOnboardingProgress(step: OnboardingStep | null) {
  try {
    const session = await requireAuth();
    
    await db
      .update(users)
      .set({ 
        onboardingStep: step,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id!));

    return { success: true };
  } catch (error) {
    console.error('Failed to save onboarding progress:', error);
    return { 
      success: false, 
      error: 'Failed to save progress' 
    };
  }
}
