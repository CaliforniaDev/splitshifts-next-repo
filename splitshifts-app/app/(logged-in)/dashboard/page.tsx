// File: app/(logged-in)/dashboard/page.tsx

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';

import TwoFactorAuthForm from './two-factor-auth-form/index';
import db from '@/db/drizzle';
import { users } from '@/db/schema/usersSchema';
import { eq } from 'drizzle-orm';

export default async function Dashboard() {
  const session = await auth();

  const [user] = await db
    .select({
      twoFactorEnabled: users.twoFactorEnabled,
    })
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id!)));

  // If user doesn't exist in database but session exists, redirect to logout
  if (!user) {
    redirect('/api/auth/signout');
  }

  return (
    // <section className='flex flex-1 rounded-xl bg-surface-container-low p-4'>
    //   <div className=''>
    //     <h1 className='typescale-title-large'>Hello Dashboard</h1>
    //   </div>
    // </section>
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Hello Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className='text-on-surface-variant'>{session?.user?.email}</div>
        <TwoFactorAuthForm twoFactorEnabled={user.twoFactorEnabled ?? false} />
      </CardContent>
    </Card>
  );
}
