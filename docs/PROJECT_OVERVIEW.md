# SplitShifts Project Overview

## Project Description
SplitShifts is a modern web application built with Next.js 15 and React 19, featuring a comprehensive dashboard navigation system with Material Design 3 styling and full accessibility support.

## Tech Stack

### Core Framework & Runtime
- **Next.js** `15.1.7` - React framework with App Router
- **React** `19.0.0` - UI library  
- **React DOM** `19.0.3` - React DOM rendering
- **TypeScript** `5.8.3` - Type safety and development experience

### Authentication & Security
- **NextAuth.js** `5.0.0-beta.25` - Authentication solution
- **@auth/core** `0.40.0` - Authentication core library
- **bcryptjs** `3.0.2` - Password hashing
- **otplib** `12.0.1` - Two-factor authentication (2FA)
- **qrcode.react** `4.2.0` - QR code generation for 2FA

### Database & ORM
- **Drizzle ORM** `0.40.1` - TypeScript-first ORM
- **Drizzle Kit** `0.31.4` - Database migrations and tooling
- **Neon Database** `0.10.4` - Serverless PostgreSQL

### Styling & UI Framework
- **Tailwind CSS** `3.4.17` - Utility-first CSS framework
- **Class Variance Authority (CVA)** `0.7.1` - Component variant management
- **Tailwind Merge** `3.3.1` - Intelligent Tailwind class merging
- **tailwindcss-animate** `1.0.7` - Animation utilities
- **tw-animate-css** `1.3.5` - Additional animations
- **clsx** `2.1.1` - Conditional className utility

### Image Processing & Optimization
- **Sharp** `0.33.6` - High-performance image processing for blur placeholders
- **Next.js Image Optimization** - Built-in WebP conversion and responsive images

### UI Component Libraries
- **Radix UI** - Headless, accessible components:
  - `@radix-ui/react-label` `2.1.7` - Form labels
  - `@radix-ui/react-slot` `1.2.3` - Component composition
  - `@radix-ui/react-toast` `1.2.14` - Toast notifications
- **Lucide React** `0.476.0` - Icon library (for logout and utility icons)
- **HeroIcons** - Icon styles and design patterns (manually implemented)

### Forms & Input Handling
- **React Hook Form** `7.60.0` - Form state management
- **@hookform/resolvers** `4.1.3` - Form validation resolvers
- **Zod** `3.25.76` - Schema validation
- **input-otp** `1.4.2` - OTP input component

### Email & Communication
- **Nodemailer** `7.0.5` - Email sending
- **@types/nodemailer** `6.4.17` - TypeScript types

### Development Tools
- **ESLint** `9.31.0` - Code linting
- **Prettier** `3.6.2` - Code formatting with Tailwind plugin
- **PostCSS** `8.5.6` - CSS processing
- **tsx** `4.20.3` - TypeScript execution
- **pnpm** `10.13.1` - Package manager

## Custom Architecture

### Dashboard Navigation System
- **Location**: `/app/components/ui/nav/dashboard/`
- **Key Components**:
  - `nav-drawer.tsx` - Main navigation container
  - `nav-list.tsx` - Navigation list components with accessibility
  - `list-variants.ts` - CVA styling variants for navigation states
  - `nav-config.tsx` - Navigation configuration and routing

### Authentication Layout System
- **Location**: `/app/components/ui/auth/`
- **Key Components**:
  - `auth-layout.tsx` - Responsive auth layouts with image optimization
  - `animated-transition.tsx` - Reusable animation wrapper for forms
- **Features**:
  - Automatic blur placeholder generation using Sharp
  - Multiple layout variants (Default, Wide, Compact)
  - CSS-based transitions for smooth loading
  - Server-side image optimization

### Icon System
- **Location**: `/app/components/ui/icons/dashboard/`
- **Architecture**: Custom React components based on HeroIcons design patterns
- **Features**:
  - Solid and outline variants
  - Consistent sizing (`h-6 w-6` default)
  - `currentColor` for theme integration
  - TypeScript union types for icon names
- **Icons Available**: home, calendar, employees, locations, settings

### Material Design 3 Implementation
- **Custom Color System**: Full MD3 palette in Tailwind config
- **Typography Scale**: Display, Headline, Body, Label, and Title variants
- **Elevation System**: 6-level shadow system
- **State Overlays**: Hover (8% opacity) and Focus (10% opacity) overlays

## Key Features

### ✅ Authentication System
- NextAuth.js integration
- Two-factor authentication with QR codes
- Password reset functionality
- Session management
- Responsive auth layouts with image optimization
- Automatic blur placeholder generation
- Smooth form animations and transitions

### ✅ Navigation System
- Material Design 3 compliant styling
- Active state detection via pathname comparison
- Keyboard navigation support (`Tab` key)
- Hover and focus overlays with proper opacity
- Accessibility with ARIA labels and semantic HTML

### ✅ Form Management
- React Hook Form with Zod validation
- Type-safe form handling
- Accessible form components

### ✅ Database Integration
- Drizzle ORM with TypeScript schemas
- Migration system
- Serverless PostgreSQL with Neon

### ✅ Accessibility Features
- Proper ARIA roles and labels
- Keyboard navigation support
- Focus-visible indicators
- Screen reader friendly navigation
- Semantic HTML structure

## Development Guidelines

### Component Architecture
- Use CVA for variant-based styling
- Implement proper TypeScript interfaces
- Follow Material Design 3 principles
- Maintain accessibility standards

### Icon Guidelines
- Use HeroIcons design patterns for consistency
- Implement solid/outline variants
- Maintain `currentColor` for theme integration
- Use descriptive TypeScript union types

### Styling Standards
- Tailwind CSS with Material Design 3 color system
- CVA for component variants
- Consistent spacing and typography scales
- Proper hover/focus state implementations

## File Structure
```
splitshifts-app/
├── app/
│   ├── components/ui/
│   │   ├── nav/dashboard/     # Navigation system
│   │   ├── auth/              # Auth layouts & animations
│   │   └── icons/dashboard/   # Icon components
│   ├── (logged-in)/          # Protected routes
│   ├── (public)/             # Public routes
│   └── api/                  # API routes
├── db/                       # Database schemas
├── lib/                      # Utilities (image processing, etc.)
└── public/                   # Static assets
```

## Package Manager
- **pnpm** - Fast, efficient package management
- Run `pnpm dev` for development
- Run `pnpm build` for production build

## Environment
- **Node.js** - Modern JavaScript runtime
- **TypeScript** - Full type safety throughout
- **Next.js App Router** - Modern routing system

---

**Last Updated**: August 2025  
**Project Version**: 0.1.0  
**Status**: Active Development
