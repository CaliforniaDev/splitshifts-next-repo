'use client';

import { usePathname } from 'next/navigation';
import { LandingNav } from '@/app/components/ui/nav/landing';
import { isAuthRoute } from '@/app/constants/auth-routes';

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
  
  // Check if current route is an authentication page
  const isAuthPage = isAuthRoute(pathname);

  if (isAuthPage) {
    // Hide navigation on auth pages
    return null;
  }

  return <LandingNav />;
}
