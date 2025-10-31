'use server';

import { NextResponse } from 'next/server';
import db from '@/db/drizzle';
import { organizations } from '@/db/schema';
import { and, isNotNull, sql, lt } from 'drizzle-orm';

/**
 * Vercel Cron Job - Cleanup Soft Deleted Organizations
 * 
 * This API route is called by Vercel Cron on a schedule.
 * It permanently deletes organizations that were soft-deleted more than 90 days ago.
 * 
 * Security: Protected by CRON_SECRET environment variable
 * Schedule: Configure in vercel.json
 */
export async function GET(request: Request) {
  // SECURITY: Verify request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const retentionDays = 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Find organizations to purge
    const organizationsToPurge = await db
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations)
      .where(
        and(
          isNotNull(organizations.deletedAt),
          lt(organizations.deletedAt, cutoffDate)
        )
      );

    const purgedIds = organizationsToPurge.map(org => org.id);
    const purgedCount = purgedIds.length;

    // Hard delete the organizations
    if (purgedCount > 0) {
      await db
        .delete(organizations)
        .where(
          and(
            isNotNull(organizations.deletedAt),
            lt(organizations.deletedAt, cutoffDate)
          )
        );
    }

    // Log the operation
    console.log(`[Cleanup Cron] Purged ${purgedCount} organizations`, {
      count: purgedCount,
      ids: purgedIds,
      cutoffDate: cutoffDate.toISOString(),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      purgedCount,
      purgedIds,
      cutoffDate: cutoffDate.toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cleanup Cron] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
