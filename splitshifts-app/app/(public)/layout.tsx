// File: app/(public)/layout.tsx

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AppNavigation from '@/app/components/ui/nav/app-navigation';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!!session?.user?.id) {
    redirect('/dashboard');
  }

  return (
    <>
      <AppNavigation />
      <main>{children}</main>
    </>
  );
}
