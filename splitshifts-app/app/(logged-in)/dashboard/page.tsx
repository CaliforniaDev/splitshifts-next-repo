// File: app/(logged-in)/dashboard/page.tsx

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { organizationUsers, organizations } from '@/db/schema';


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import Button from '@/app/components/ui/buttons/button';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/signout');
  }

  // Check if user has an organization
  const [userOrg] = await db
    .select({
      orgId: organizationUsers.orgId,
      orgName: organizations.name,
      orgSettings: organizations.settings,
    })
    .from(organizationUsers)
    .innerJoin(organizations, eq(organizationUsers.orgId, organizations.id))
    .where(eq(organizationUsers.userId, session.user.id!));

  // Phase 1: No organization - Show onboarding wizard
  if (!userOrg) {
    return (
      <Card className='w-full max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className="typescale-display-large">🎉 Welcome to SplitShifts!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-on-surface-variant">
            Let's get you set up in a few easy steps. First, we need to create your organization.
          </p>
          
          <div className="bg-surface-container rounded-lg p-4 space-y-2">
            <h3 className="font-medium">Setup Steps:</h3>
            <ul className="space-y-1 typescale-body-medium text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span className="text-primary">⏳</span> 1. Create your organization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-surface-variant">⏳</span> 2. Add your first location (if applicable)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-surface-variant">⏳</span> 3. Create job roles
              </li>
              <li className="flex items-center gap-2">
                <span className="text-surface-variant">⏳</span> 4. Add employees
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="filled">
              Continue Setup
            </Button>
            <Button variant="outlined">
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Phase 2: Has organization but needs core setup (TODO: Check for locations, roles, employees)
  // Phase 3: Normal dashboard (for now, show simple dashboard)
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Hello Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className='text-on-surface-variant'>{session?.user?.email}</div>
        
        <div className="mt-4 p-3 bg-surface-container rounded-lg">
          <Label>Organization</Label>
          <div className='text-on-surface-variant'>{userOrg.orgName}</div>
        </div>
      </CardContent>
    </Card>
  );
}
