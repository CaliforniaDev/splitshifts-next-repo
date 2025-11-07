// File: app/(logged-in)/layout.tsx

import { requireSession } from '@/app/lib/auth-utils';
import NavDrawer from '@/app/components/ui/nav/dashboard/nav-drawer';
import AuthSessionProvider from '@/app/components/providers/session-provider';

export default async function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fast session check without DB query - pages handle DB validation
  await requireSession();
  return (
    <AuthSessionProvider>
      <NavDrawer />
      <main className='ml-64 flex min-h-screen flex-1 gap-6 bg-surface p-8'>
        {children}
      </main>
    </AuthSessionProvider>
  );
}
