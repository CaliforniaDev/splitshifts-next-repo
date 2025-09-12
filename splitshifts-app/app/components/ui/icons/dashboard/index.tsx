// Individual icon exports
export { HomeIcon } from './home-icon';
export { CalendarIcon } from './calendar-icon';
export { EmployeesIcon } from './employees-icon';
export { LocationsIcon } from './locations-icon';
export { ArchivesIcon } from './archives-icon';
export { RemindersIcon } from './reminders-icon';
export { SettingsIcon } from './settings-icon';
export { KeyIcon } from './key-icon';
export { BriefcaseIcon } from './briefcase';

// Types
export interface DashboardIconProps {
  className?: string;
  variant?: 'solid' | 'outline';
}

// Icon names type for type safety
export type DashboardIconName =
  | 'home'
  | 'calendar'
  | 'employees'
  | 'locations'
  | 'archives'
  | 'reminders'
  | 'settings'
  | 'key'
  | 'briefcase';

// Navigation items type for dashboard
export interface NavItem {
  name: string;
  href: string;
  icon: DashboardIconName;
  current?: boolean;
}
