// File: app/(logged-in)/layout.tsx

import { auth } from '@/auth';

import NavDrawer from '@/app/components/ui/nav/dashboard/nav-drawer';
export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className='min-h--screen flex'>
      <NavDrawer />
      <main className='flex flex-col gap-2'>
        <h1>Logged In Layout</h1>
        {session?.user?.email ? (
          <div>{session.user.email}</div>
        ) : (
          'No Current user logged in'
        )}
        {children}
      </main>
    </div>
  );
}
