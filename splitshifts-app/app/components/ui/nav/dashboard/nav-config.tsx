import type { DashboardIconName } from '@/app/components/ui/icons/dashboard';

/**
 * Navigation matching strategies
 */
export type NavMatchStrategy = 'exact' | 'startsWith';

/**
 * Navigation Item Interface
 * 
 * Defines the structure for dashboard navigation items with flexible matching.
 */
export interface NavItem {
  name: string;
  href: string;
  icon: DashboardIconName;
  /**
   * How to match the current pathname for active state
   * - 'exact': pathname must exactly match href
   * - 'startsWith': pathname must start with href (for parent routes with sub-pages)
   */
  matchStrategy?: NavMatchStrategy;
}

/**
 * Utility function to determine if a nav item should be active
 */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  const strategy = item.matchStrategy ?? 'exact';
  
  switch (strategy) {
    case 'startsWith':
      return pathname.startsWith(item.href);
    case 'exact':
    default:
      return pathname === item.href;
  }
}

/**
 * Dashboard Navigation Configuration
 * 
 * Static configuration for all dashboard navigation items.
 * Active states are determined at runtime using the specified match strategy.
 */
export const dashboardNavigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'home',
    matchStrategy: 'exact'
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: 'calendar',
    matchStrategy: 'startsWith' // Supports sub-routes like /dashboard/calendar/week
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: 'employees',
    matchStrategy: 'startsWith' // Supports sub-routes like /dashboard/employees/[id]
  },
  {
    name: 'Locations',
    href: '/dashboard/locations',
    icon: 'locations',
    matchStrategy: 'startsWith' // Supports sub-routes like /dashboard/locations/[id]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'settings',
    matchStrategy: 'startsWith' // Supports sub-routes like /settings/change-password
  }
];
