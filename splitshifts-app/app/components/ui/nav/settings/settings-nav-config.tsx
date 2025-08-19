import type { DashboardIconName } from '@/app/components/ui/icons/dashboard';

/**
 * Settings Navigation Item Interface
 */
export interface SettingsNavItem {
  name: string;
  href: string;
  icon: DashboardIconName;
  description?: string;
}

/**
 * Settings Navigation Configuration
 * 
 * Sub-navigation items for the settings section.
 * Provides organized access to different settings categories.
 */
export const settingsNavigation: SettingsNavItem[] = [
  {
    name: 'Account',
    href: '/settings/account',
    icon: 'home',
    description: 'Profile and basic account settings'
  },
  {
    name: 'Change Password',
    href: '/settings/change-password',
    icon: 'key',
    description: 'Update your account password'
  },
  {
    name: 'Security',
    href: '/settings/security',
    icon: 'settings',
    description: 'Two-factor authentication and security options'
  }
];
