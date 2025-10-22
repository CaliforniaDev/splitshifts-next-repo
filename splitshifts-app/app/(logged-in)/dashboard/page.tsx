import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { eq, and, isNull } from 'drizzle-orm';
import { organizationUsers, organizations } from '@/db/schema';

import OrganizationManagementClient from './components/organization/management-client';
import { OnboardingWizard } from './components/onboarding-wizard';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';



/**
 * Main Dashboard Page
 *
 * Displays different views based on user's organization status:
 * - No organization: Shows onboarding wizard
 * - Has organization: Shows dashboard with org management
 *
 * Filters out soft-deleted organizations from the query.
 */
export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  // Check if user has an organization (excluding deleted ones)
  const [userOrg] = await db
    .select({
      orgId: organizationUsers.orgId,
      orgName: organizations.name,
      orgDescription: organizations.description,
      orgWeekStartDay: organizations.weekStartDay,
      orgSettings: organizations.settings,
    })
    .from(organizationUsers)
    .innerJoin(organizations, eq(organizationUsers.orgId, organizations.id))
    .where(
      and(
        eq(organizationUsers.userId, session.user.id!),
        isNull(organizations.deletedAt)
      )
    );

  // No organization - show onboarding wizard
  if (!userOrg) {
    return (
      <div className='flex items-start justify-center p-4'>
        <OnboardingWizard />
      </div>
    );
  }

  // Has organization - show dashboard
  // TODO: Check for incomplete setup (locations, roles, employees)
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Hello Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className='text-on-surface-variant'>{session?.user?.email}</div>

        <div className='mt-4 rounded-lg bg-surface-container p-3'>
          <Label>Organization</Label>
          <div className='text-on-surface-variant'>{userOrg.orgName}</div>
        </div>
        <OrganizationManagementClient 
          organization={{
            id: userOrg.orgId,
            name: userOrg.orgName,
            description: userOrg.orgDescription,
            weekStartDay: userOrg.orgWeekStartDay,
          }}
        />
      </CardContent>
    </Card>
  );
}
