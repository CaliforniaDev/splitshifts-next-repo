// File: app/(logged-in)/dashboard/page.tsx

import { auth } from '@/auth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';

export default async function Dashboard() {
  const session = await auth();

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Hello Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className='text-on-surface-variant'>{session?.user?.email}</div>
      </CardContent>
    </Card>
  );
}
