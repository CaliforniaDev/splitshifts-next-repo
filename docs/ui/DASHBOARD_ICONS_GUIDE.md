# Dashboard Icons Usage Guide

This guide shows you how to use the dashboard SVG icons that have been converted to React components.

## 📁 File Structure

```text
app/components/ui/icons/dashboard/
├── index.tsx                    # Main exports and types
├── dashboard-icon.tsx           # Unified icon component
├── navigation.tsx               # Sample navigation config
├── home-icon.tsx               # Individual icon components
├── calendar-icon.tsx
├── employees-icon.tsx
├── locations-icon.tsx
├── archives-icon.tsx
├── reminders-icon.tsx
├── settings-icon.tsx
└── [SVG files...]              # Original SVG files
```

## 🚀 Usage Examples

### Method 1: Individual Icon Components

```tsx
import { HomeIcon, CalendarIcon, SettingsIcon } from '@/components/ui/icons/dashboard';

export function MyComponent() {
  return (
    <div className="flex space-x-4">
      {/* Default outlined variant */}
      <HomeIcon className="h-6 w-6 text-gray-600" />
      
      {/* Filled variant */}
      <CalendarIcon className="h-6 w-6 text-blue-600" variant="filled" />
      
      {/* Custom size */}
      <SettingsIcon className="h-8 w-8 text-gray-800" />
    </div>
  );
}
```

### Method 2: Unified DashboardIcon Component

```tsx
import { DashboardIcon } from '@/components/ui/icons/dashboard/dashboard-icon';

export function MyComponent() {
  return (
    <div className="flex space-x-4">
      {/* Type-safe icon names */}
      <DashboardIcon name="home" className="h-6 w-6 text-gray-600" />
      <DashboardIcon name="calendar" variant="filled" className="h-6 w-6 text-blue-600" />
      <DashboardIcon name="employees" className="h-8 w-8 text-green-600" />
    </div>
  );
}
```

### Method 3: Navigation Menu Example

```tsx
import { DashboardIcon } from '@/components/ui/icons/dashboard/dashboard-icon';
import { dashboardNavigation } from '@/components/ui/icons/dashboard/navigation';
import Link from 'next/link';

export function NavigationDrawer() {
  return (
    <nav className="space-y-2">
      {dashboardNavigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
            item.current 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <DashboardIcon 
            name={item.icon} 
            variant={item.current ? 'filled' : 'outlined'}
            className="h-5 w-5" 
          />
          <span className="font-medium">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
}
```

## 🎨 Icon Variants

Each icon supports two variants:

- **`outlined`** (default): Stroke-based outline style
- **`filled`**: Solid fill style

```tsx
// Outlined (default)
<HomeIcon variant="outlined" />
<DashboardIcon name="home" variant="outlined" />

// Filled
<HomeIcon variant="filled" />
<DashboardIcon name="home" variant="filled" />
```

## 🎯 Available Icons

| Icon Name | Component | Description |
|-----------|-----------|-------------|
| `home` | `HomeIcon` | Dashboard home/overview |
| `calendar` | `CalendarIcon` | Calendar and scheduling |
| `employees` | `EmployeesIcon` | Staff and team management |
| `locations` | `LocationsIcon` | Locations and buildings |
| `archives` | `ArchivesIcon` | Archives and storage |
| `reminders` | `RemindersIcon` | Notifications and reminders |
| `settings` | `SettingsIcon` | Settings and configuration |

## 🔧 TypeScript Support

The components include full TypeScript support:

```tsx
import type { DashboardIconProps, DashboardIconName, NavItem } from '@/components/ui/icons/dashboard';

// Type-safe icon names
const iconName: DashboardIconName = 'home'; // ✅ Valid
const iconName: DashboardIconName = 'invalid'; // ❌ TypeScript error

// Navigation item type
const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'home', // Type-safe
    current: true
  }
];
```

## 🎨 Styling Tips

### With Tailwind CSS

```tsx
// Different colors
<HomeIcon className="h-6 w-6 text-blue-600" />
<CalendarIcon className="h-6 w-6 text-green-500" />

// Hover effects
<SettingsIcon className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />

// Active states
<DashboardIcon 
  name="home" 
  variant={isActive ? 'filled' : 'outlined'}
  className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
/>
```

### Custom CSS

The icons use `currentColor` for fills and strokes, so they inherit the text color:

```css
.my-icon {
  color: #3b82f6; /* Blue color */
  width: 1.5rem;
  height: 1.5rem;
}
```

## 🔄 Dynamic Icon Switching

```tsx
import { useState } from 'react';
import { DashboardIcon, type DashboardIconName } from '@/components/ui/icons/dashboard';

export function DynamicIconExample() {
  const [selectedIcon, setSelectedIcon] = useState<DashboardIconName>('home');
  const [variant, setVariant] = useState<'filled' | 'outlined'>('outlined');

  return (
    <div className="space-y-4">
      <DashboardIcon 
        name={selectedIcon} 
        variant={variant}
        className="h-12 w-12 text-blue-600" 
      />
      
      <div className="space-x-2">
        <button onClick={() => setVariant(variant === 'filled' ? 'outlined' : 'filled')}>
          Toggle Variant ({variant})
        </button>
      </div>
    </div>
  );
}
```

## 📱 Responsive Sizing

```tsx
// Responsive icon sizes
<DashboardIcon 
  name="home" 
  className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" 
/>

// Mobile navigation
<div className="sm:hidden">
  <DashboardIcon name="home" className="h-5 w-5" />
</div>

// Desktop navigation
<div className="hidden sm:block">
  <DashboardIcon name="home" className="h-6 w-6" />
</div>
```
