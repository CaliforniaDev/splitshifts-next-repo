import type { DashboardIconName } from '@/app/components/ui/icons/dashboard';

/**
 * Navigation Item Interface
 * 
 * Defines the structure for dashboard navigation items.
 * Active state is determined dynamically via pathname comparison.
 */
export interface NavItem {
  name: string;
  href: string;
  icon: DashboardIconName;
}

/**
 * Dashboard Navigation Configuration
 * 
 * Static configuration for all dashboard navigation items.
 * Active states are determined at runtime by comparing current pathname.
 */
export const dashboardNavigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'home'
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: 'calendar'
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: 'employees'
  },
  {
    name: 'Locations',
    href: '/dashboard/locations',
    icon: 'locations'
  },
  {
    name: 'Change Password',
    href: '/change-password',
    icon: 'settings'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'settings'
  }
];
