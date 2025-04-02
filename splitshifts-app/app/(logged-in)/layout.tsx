// File: app/(logged-in)/layout,

import NavDrawer from '@/app/components/ui/nav/dashboard/nav-drawer';
export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <NavDrawer />
      <main className='flex flex-1 gap-6 bg-surface-dim p-8'>{children}</main>
    </div>
  );
}
