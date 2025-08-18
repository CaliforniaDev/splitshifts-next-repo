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
  if (session?.user?.id) {
    redirect('/dashboard');
  }

  return (
    <div className='min-h-screen bg-landing-gradient bg-no-repeat'>
      <AppNavigation />
      <main className='flex flex-col items-center p-24 text-on-surface'>
        {children}
      </main>
    </div>
  );
}
