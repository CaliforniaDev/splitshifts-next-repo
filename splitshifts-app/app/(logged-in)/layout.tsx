// File: app/(logged-in)/layout,

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import NavDrawer from '@/app/components/ui/nav/dashboard/nav-drawer';


export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/');
  }
  return (
    <div className='flex min-h-screen'>
      <NavDrawer />
      <main className='flex flex-1 gap-6 bg-surface-dim p-8'>{children}</main>
    </div>
  );
}
