/**
 * Dashboard Navigation Drawer
 * 
 * Main navigation component for the dashboard with:
 * - Logo header
 * - Dynamic navigation items with active states
 * - Logout functionality
 * - Material Design 3 styling
 * - Full accessibility support
 */

'use client';

// Core Next.js imports
import Link from 'next/link';

// Third-party imports
import { usePathname } from 'next/navigation';
import { LogOut as LogoutIcon } from 'lucide-react';

// Internal component imports
import Logo from '@/app/components/ui/logo';
import { List, ListItemLink } from './nav-list';
import { DashboardIcon } from '@/app/components/ui/icons/dashboard/dashboard-icon-picker';

// Configuration and actions
import { dashboardNavigation, isNavItemActive } from './nav-config';
import { logOut } from '@/app/(public)/(auth)/actions/logout';

export default function NavDrawer() {
  const pathname = usePathname();
  
  /**
   * Handle user logout with error handling
   */
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };
  
  return (
    <aside 
      className='h-screen w-64 bg-surface-container text-on-surface-variant'
      role='complementary'
      aria-label='Dashboard navigation'
    >
      <div className='flex h-full flex-col space-y-4 px-5 py-[38px]'>
        {/* Logo Header */}
        <header className='flex h-14 px-1 text-xl font-semibold'>
          <Link href="/" className="inline-block">
            <Logo width={38} height={38} textClassName='text-xl' />
          </Link>
        </header>

        {/* Main Navigation */}
        <nav 
          className='flex h-full flex-col justify-between space-y-2'
          aria-label='Main navigation'
        >
          {/* Navigation Links */}
          <List>
            {dashboardNavigation.map(item => {
              const isActive = isNavItemActive(pathname, item);
              
              return (
                <ListItemLink
                  key={item.name}
                  href={item.href}
                  label={item.name}
                  isActive={isActive}
                  icon={
                    <DashboardIcon
                      name={item.icon}
                      variant={isActive ? 'solid' : 'outline'}
                    />
                  }
                />
              );
            })}
          </List>
          
          {/* Logout Section */}
          <div>
            <button
              onClick={handleLogout}
              className='mt-auto flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-outline'
              aria-label='Sign out of your account'
            >
              <LogoutIcon className='h-5 w-5' />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
