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
    <>
      <NavDrawer />
      <main className='ml-64 flex min-h-screen flex-1 gap-6 bg-surface p-8'>
        {children}
      </main>
    </>
  );
}
