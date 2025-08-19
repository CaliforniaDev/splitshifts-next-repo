# Architecture Guide

## System Overview

SplitShifts follows a modern, component-based architecture using Next.js 15 with the App Router pattern. The application is structured around Material Design 3 principles with full accessibility support.

## Architecture Patterns

### Component Architecture
- **Atomic Design** - Components organized in a hierarchy (atoms → molecules → organisms)
- **CVA (Class Variance Authority)** - Variant-based styling system
- **Composition Pattern** - Using Radix UI's slot pattern for flexible components

### State Management
- **Server State** - Next.js App Router with RSC (React Server Components)
- **Client State** - React Hook Form for form state
- **Authentication State** - NextAuth.js session management

### Styling Architecture
- **Tailwind CSS** - Utility-first styling
- **Material Design 3** - Design system implementation
- **CVA Variants** - Component styling variants
- **Theme System** - CSS custom properties for theming

## Directory Structure

```
splitshifts-app/
├── app/                              # Next.js App Router
│   ├── components/ui/                # UI component library
│   │   ├── nav/dashboard/           # Navigation components
│   │   │   ├── nav-drawer.tsx      # Main navigation container
│   │   │   ├── nav-list.tsx        # List components with a11y
│   │   │   ├── list-variants.ts    # CVA styling variants
│   │   │   └── nav-config.tsx      # Navigation configuration
│   │   ├── icons/dashboard/         # Icon system
│   │   │   ├── dashboard-icon-picker.tsx
│   │   │   ├── home-icon.tsx
│   │   │   ├── calendar-icon.tsx
│   │   │   └── [other-icons].tsx
│   │   └── [other-ui-components]/
│   ├── (logged-in)/                 # Protected route group
│   ├── (public)/                    # Public route group
│   └── api/                         # API routes
├── db/                              # Database layer
│   ├── schema.ts                   # Drizzle schemas
│   └── drizzle.ts                  # Database connection
└── public/                          # Static assets
```

## Design Patterns

### 1. Navigation System
**Pattern**: Configuration-driven navigation with dynamic active states

```tsx
// Configuration
const dashboardNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'home' }
];

// Component automatically detects active state
const isActive = pathname === href;
```

### 2. Icon System
**Pattern**: Unified icon picker with variant support

```tsx
// Individual icon components
export function HomeIcon({ variant = 'outline' }) {
  return variant === 'solid' ? <SolidIcon /> : <OutlineIcon />;
}

// Unified picker
<DashboardIcon name="home" variant="solid" />
```

### 3. Styling System
**Pattern**: CVA-based variant system with Material Design compliance

```tsx
const listItemVariants = cva(baseStyles, {
  variants: {
    active: { true: 'bg-secondary-container', false: 'text-muted' },
    overlay: { default: 'overlay-styles', active: 'active-overlay' }
  },
  compoundVariants: [
    { active: true, overlay: 'active', class: 'custom-styles' }
  ]
});
```

## Data Flow

### Authentication Flow
1. User authentication via NextAuth.js
2. Session management with JWT/database sessions
3. Route protection using middleware
4. 2FA integration with QR codes

### Navigation Flow
1. Route changes trigger pathname updates
2. Components automatically detect active states
3. CVA variants apply appropriate styles
4. Accessibility attributes updated

### Form Flow
1. React Hook Form manages form state
2. Zod validation schemas
3. Server actions for form submission
4. Toast notifications for feedback

## Performance Considerations

### Bundle Optimization
- **Tree Shaking** - Only used icons included
- **Code Splitting** - Route-based splitting with App Router
- **Static Generation** - Where possible with Next.js

### Runtime Optimization
- **CVA Caching** - Compiled class variants
- **React Server Components** - Server-side rendering
- **Image Optimization** - Next.js Image component

## Accessibility Architecture

### ARIA Implementation
- **Semantic HTML** - Proper element usage
- **ARIA Labels** - Descriptive labels for screen readers
- **Focus Management** - Keyboard navigation support
- **Live Regions** - Dynamic content announcements

### Keyboard Navigation
- **Tab Order** - Logical navigation flow
- **Focus Indicators** - Clear visual focus states
- **Escape Handling** - Modal and menu dismissal

## Testing Strategy

### Component Testing
- **Unit Tests** - Individual component logic
- **Integration Tests** - Component interactions
- **Accessibility Tests** - a11y compliance validation

### E2E Testing
- **User Flows** - Critical path testing
- **Cross-browser** - Compatibility testing
- **Mobile Testing** - Responsive behavior

## Security Architecture

### Authentication Security
- **Session Management** - Secure session handling
- **CSRF Protection** - Built-in Next.js protection
- **2FA Integration** - Time-based OTP

### Data Security
- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Drizzle ORM protection
- **Environment Variables** - Secure config management

---

**Last Updated**: August 2025
