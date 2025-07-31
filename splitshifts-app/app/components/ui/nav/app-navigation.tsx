'use client';

import { usePathname } from 'next/navigation';
import { LandingNav } from '@/app/components/ui/nav/landing';

/**
 * AppNavigation - Conditionally renders navigation based on the current route
 * 
 * This component automatically hides navigation on authentication pages
 * while preserving it on other public pages like landing, pricing, etc.
 * 
 * @returns Navigation component or null for auth pages
 */
export default function AppNavigation() {
  const pathname = usePathname();
  
  // Define auth routes where navigation should be hidden
  const authRoutes = [
    '/login', 
    '/signup', 
    '/password-reset', 
    '/update-password',
    '/verify-email',
    '/resend-verification'
  ];
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route));

  if (isAuthPage) {
    // Hide navigation on auth pages
    return null;
  }

  return <LandingNav />;
}
