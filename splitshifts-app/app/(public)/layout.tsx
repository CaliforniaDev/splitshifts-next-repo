// File: app/(public)/layout.tsx

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LandingNav } from '@/app/components/ui/nav/landing';

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
      <LandingNav />
      <main>{children}</main>
    </>
  );
}
