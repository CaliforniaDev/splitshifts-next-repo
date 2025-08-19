import React from 'react';
import {
  HomeIcon,
  CalendarIcon,
  EmployeesIcon,
  LocationsIcon,
  ArchivesIcon,
  RemindersIcon,
  SettingsIcon,
  KeyIcon,
  type DashboardIconProps,
  type DashboardIconName
} from './index';

interface UnifiedDashboardIconProps extends DashboardIconProps {
  name: DashboardIconName;
}

const iconComponents = {
  home: HomeIcon,
  calendar: CalendarIcon,
  employees: EmployeesIcon,
  locations: LocationsIcon,
  archives: ArchivesIcon,
  reminders: RemindersIcon,
  settings: SettingsIcon,
  key: KeyIcon,
} as const;

export function DashboardIcon({ name, className = 'h-6 w-6', variant = 'outline' }: UnifiedDashboardIconProps) {
  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    console.warn(`DashboardIcon: Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent className={className} variant={variant} />;
}

// Export for convenience
export default DashboardIcon;
