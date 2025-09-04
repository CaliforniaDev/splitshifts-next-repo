# SplitShifts

SplitShifts is a web application designed to streamline the scheduling process for organizations. Built with Next.js, this admin-focused app offers a comprehensive dashboard for managing shifts, appointments, and events efficiently. Key features include viewing upcoming shifts, handling appointments, managing current events, and setting reminders. The app aims to reduce scheduling conflicts and improve overall productivity.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Services and Tools](#services-and-tools)
- [License](#license)
- [Contact](#contact)
- [Key Dependencies](#key-dependencies)
- [Development Tools](#development-tools)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Security & Token Management](#security--token-management)
- [Styling](#styling)
- [Email Integration](#email-integration)
- [Documentation](#documentation)

## Features

### Implemented Features

- **Complete Authentication System**: Full-featured user authentication with secure registration, login, and session management
  - **User Registration**: Sign-up form with first name, last name, email, password validation and confirmation
  - **Email Verification**: Complete email verification flow with token-based validation
    - **Verification Email Sending**: Automated verification emails sent upon registration
    - **Token Validation**: Secure token-based email verification with expiration handling
    - **Resend Verification**: Dedicated flow for resending verification emails with user-friendly interface
    - **Verification Status Tracking**: Database integration for tracking email verification status
    - **Success & Error States**: Comprehensive user feedback with animated success confirmations
  - **Secure Login**: Multi-step login process with email/password authentication and email verification checks
  - **Password Reset Flow**: Email-based password reset with secure token validation
  - **Password Updates**: Secure password change functionality for authenticated users
  - **Session Management**: Automatic session handling with NextAuth.js integration
  - **Enhanced User Experience**: Auto-focus functionality across all authentication forms for improved accessibility and user flow
- **Two-Factor Authentication (2FA)**: Enterprise-grade security with TOTP support
  - **QR Code Setup**: Generate QR codes for authenticator apps (Google Authenticator, Authy, etc.)
  - **6-Digit OTP Verification**: Secure time-based one-time password validation
  - **2FA Management**: Enable/disable 2FA from user dashboard
  - **Multi-Step Login**: Conditional 2FA verification during login process
- **Conditional Navigation**: Smart navigation component that automatically hides the navbar on authentication pages while preserving it on public pages
- **Responsive UI Components**: Comprehensive component library with consistent styling
  - **Reusable Forms**: Modern Input component with validation, error handling, and ref forwarding support
  - **OTP Input Component**: Specialized 6-digit OTP input with accessibility features
  - **Authentication Cards**: Consistent card-based design for all auth flows
  - **Component Modernization**: Unified form interface using standardized Input component across all authentication forms
  - **AuthLayout System**: Professional responsive layout for authentication pages
    - **Three Layout Variants**: Default (50/50), Wide (60/40), and Compact (66/33) split layouts
    - **Responsive Design**: Mobile-first approach with image hidden on mobile devices
    - **Image Optimization**: Automatic blur placeholder generation using Sharp for improved perceived performance
    - **Smooth Transitions**: CSS-based opacity transitions (500ms) for seamless loading experience
    - **Smart Image Loading**: Next.js Image optimization with conditional loading based on screen size
    - **Clickable Logo**: Integrated logo component with navigation back to home page
    - **Flexible Customization**: Configurable image sources, overlay options, and layout direction
- **Advanced Form Validation**: Real-time validation using Zod schemas
  - **Client-side Validation**: Immediate feedback on form inputs with auto-focus for better user experience
  - **Server-side Validation**: Secure validation of all authentication data
  - **Error Handling**: Comprehensive error states and user feedback with structured error display components
  - **Email Verification Integration**: Contextual error handling that provides verification resend options for unverified accounts
- **Email Integration**: Comprehensive transactional email support
  - **Verification Emails**: Automated email verification system with secure token delivery
  - **Password Reset Emails**: Email-based password reset with secure links
  - **Resend Functionality**: User-friendly resend options with proper rate limiting
  - **Email Templates**: Professional email templates for all authentication flows
- **Database Integration**: PostgreSQL with Drizzle ORM for secure user data storage
- **Enhanced Security Features**: 
  - **Password Hashing**: Secure password storage with bcrypt
  - **Email Verification**: Mandatory email verification for account activation with secure token-based validation
  - **Centralized Token Management**: Unified token generation and validation system for consistency and security
    - **Secure Token Generation**: Cryptographically secure 64-character hex tokens using `randomBytes(32)` with 256-bit entropy
    - **Format Validation**: Centralized token format validation with TypeScript type guards (`isValidTokenFormat()`)
    - **URL Validation**: Environment variable validation for `SITE_BASE_URL` with production HTTPS enforcement
    - **Token Utilities**: Shared utilities (`generateSecureToken()`, `buildVerificationLink()`, `buildPasswordResetLink()`)
    - **Security Documentation**: Comprehensive token format decision rationale (hex vs JWT)
  - **Environment-Specific Error Logging**: Production-safe error logging (`logError()`) that protects sensitive information
  - **Professional Email Templates**: Consistent HTML email templates across verification and password reset flows
  - **Token-based Reset**: Secure password reset tokens with 1-hour expiration for enhanced security
  - **Route Protection**: Authentication middleware for protected routes with email verification checks
  - **Session Security**: Secure session management and CSRF protection
  - **Rate Limiting**: Protection against spam and abuse in email sending and verification processes
- **Enhanced User Experience (UX)**:
  - **Auto-Focus Functionality**: Consistent auto-focus across all authentication forms for better accessibility
  - **Animated Success States**: Professional celebration animations with reusable AnimatedCheckIcon component
  - **Visual Consistency**: Centered layouts and consistent styling across all authentication flows
  - **Professional Email Templates**: HTML-styled emails with consistent branding and messaging
  - **Responsive Design**: Mobile-first responsive components with Tailwind CSS
- **Modern Animation System**:
  - **Centralized Animations**: Custom keyframes and animations in Tailwind config for maintainability
  - **Celebration Effects**: Multi-layered animations (ping, pulse, bounce, draw) for success states
  - **Performance Optimized**: CSS-based animations with proper animation delays and durations
  - **Reusable Components**: Extracted AnimatedCheckIcon with size variants (small/medium/large)
- **TypeScript Support**: Full TypeScript implementation for type safety and better developer experience

### Planned Features

- User-friendly admin dashboard
- Manage upcoming shifts, appointments, and current events
- Set and view reminders for important tasks
- Real-time alerts for shift coverage and scheduling changes
- Employee availability summary
- Shift swap and schedule change request handling

## Technologies Used

- **Next.js 15**: React framework with App Router for server-side rendering and routing
- **React 19**: Frontend library for building user interfaces
- **TypeScript**: Static type checking for enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Sharp**: High-performance image processing for blur placeholders and optimization
- **PostgreSQL**: Relational database via Neon serverless platform
- **Drizzle ORM**: Type-safe database operations and schema management
- **NextAuth.js**: Authentication and session management
- **Zod**: Schema validation for forms and API endpoints
- **React Hook Form**: Performant forms with minimal re-renders

## Services and Tools

This application leverages the following services and tools:

- **Neon Databases**: A modern cloud-based database solution for scalable and efficient data storage.
- **Drizzle ORM**: A lightweight TypeScript ORM for interacting with the database.
- **Resend.com**: A service for sending transactional emails and managing email templates.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v18 or higher) and **pnpm** installed
- **PostgreSQL** database (via Neon or local setup)
- **Environment variables** configured (see Environment Variables section)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CaliforniaDev/splitshifts-nextjs.git
   ```

2. Navigate to project directory:

   ```bash
   cd splitshifts-next-repo/splitshifts-app
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   pnpm run dev
   ```

2. Open your browser and visit 'http://localhost:3000' to see the app in action.

### Overview

This project uses a consistent type scale across various components and pages. The type scale is defined in multiple files, including `typography.css`, `tailwind.config.ts`, `fonts.ts`, and `layout.tsx`.

### Files and Their Roles

- **typography.css**: Defines the type scale categories such as Display, Headline, Title, Label, and Body fonts.
- **tailwind.config.ts**: Extends Tailwind's theme to include custom colors and typography settings.
- **fonts.ts**: Defines the font families and their respective weights.
- **layout.tsx**: Applies the defined typography and layout styles to the application.

### How They Link Together

The type scale defined in `typography.css` is referenced in the Tailwind configuration to ensure consistent typography across the application. Tailwind's `@layer` feature is used to apply these styles globally. The `fonts.ts` file defines the font families and weights, which are then used in `tailwind.config.ts`. The `layout.tsx` file applies these styles to the application layout.

Refer to the comments in each file for more detailed information.

## Key Dependencies

- **@auth/core**: Provides authentication and session management for server-side applications.
- **next-auth**: Extends authentication capabilities for Next.js, including OAuth and session handling.
- **drizzle-orm**: A lightweight ORM for database schema management and queries.
- **@neondatabase/serverless**: Integration with Neon for serverless PostgreSQL databases.
- **tailwindcss**: Utility-first CSS framework for styling.
- **tailwindcss-animate** and **tw-animate-css**: Plugins for animations in TailwindCSS.
- **zod**: Schema validation library for TypeScript.
- **nodemailer**: Email sending library for server-side applications.
- **react-hook-form**: Library for managing forms and validation in React.
- **@hookform/resolvers**: Provides schema validation for forms using libraries like Zod.
- **dotenv**: Manages environment variables securely.
- **lucide-react**: Icon library for React applications.
- **class-variance-authority** and **clsx**: Utilities for managing conditional class names in React components.
- **otplib**: is a JavaScript One Time Password (OTP) library for OTP generation and verification.
- **qrcode.react**: A React component to generate QR codes for rendering to the DOM.

## Development Tools

- **eslint**: Ensures code quality and consistency.
- **prettier**: Formats code for readability.
- **tsx**: Executes TypeScript files directly during development.
- **drizzle-kit**: CLI tool for managing database migrations and schema generation.

## Scripts

- `dev`: Start the development server with Turbopack for faster builds.
- `dev:network`: Start the development server with network access on all interfaces.
- `build`: Build the application for production.
- `start`: Start the production server.
- `lint`: Run linting checks using ESLint.

## Environment Variables

This project uses `dotenv` to manage environment variables. Ensure you have a `.env` file with the required variables.

### Required Environment Variables

```env
# Database Configuration
DATABASE_URL="your-postgres-connection-string"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Email Configuration
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# Site Configuration (REQUIRED for email links)
SITE_BASE_URL="http://localhost:3000"    # Development: HTTP/HTTPS allowed
# SITE_BASE_URL="https://yourdomain.com" # Production: HTTPS required for security
```

### Environment Variable Validation

The application includes built-in validation for critical environment variables:

- **`SITE_BASE_URL`**: Automatically validated to ensure it's a properly formatted URL
  - **Development**: Allows both HTTP and HTTPS for local development flexibility
  - **Production**: Enforces HTTPS-only for security (prevents man-in-the-middle attacks)
- **Email Configuration**: Validated during email sending to prevent configuration errors
- **Token Security**: Environment-specific logging protects sensitive information in production

**Note**: Missing or malformed `SITE_BASE_URL` will cause email verification and password reset links to fail with clear error messages. Production deployments must use HTTPS URLs.

For comprehensive security information, see [SECURITY.md](./SECURITY.md).

## Database

The project integrates with Neon using `@neondatabase/serverless` and `drizzle-orm` for database management.

## Security & Token Management

The application implements a robust security system with centralized token management:

### Token System

All authentication tokens (email verification, password reset) use a standardized secure format:

```typescript
import { generateSecureToken, isValidTokenFormat } from '@/app/lib/utils';

// Generate a secure token
const token = generateSecureToken(); // Returns 64-char hex string

// Validate token format
if (isValidTokenFormat(token)) {
  // Token is valid format
}
```

### URL Generation

Email links are generated with built-in validation:

```typescript
import { buildVerificationLink, buildPasswordResetLink } from '@/app/lib/utils';

// These functions automatically validate SITE_BASE_URL
const verificationLink = buildVerificationLink(token);
const resetLink = buildPasswordResetLink(token);
```

### Error Logging

Production-safe error logging that protects sensitive information:

```typescript
import { logError } from '@/app/lib/utils';

try {
  // Some operation
} catch (error) {
  // Development: logs full error details
  // Production: logs generic message only
  logError('Operation failed', error);
}
```

### Configuration Constants

Token configuration is centralized for consistency:

```typescript
import { TOKEN_CONFIG } from '@/app/lib/utils';

// Available constants:
// TOKEN_CONFIG.BYTE_LENGTH (32) - 256-bit entropy
// TOKEN_CONFIG.HEX_LENGTH (64) - Resulting hex string length
// TOKEN_CONFIG.VALIDATION_PATTERN (/^[a-fA-F0-9]{64}$/) - Format validation
```

### Security Design Decision: Hex Tokens vs JWT

We use simple hex tokens (256-bit entropy) instead of JWT for email verification and password reset because:

- **Revocable**: Database-managed tokens can be immediately invalidated
- **Simple**: Minimal complexity reduces security vulnerabilities  
- **Stateful**: Better control over token lifecycle
- **Required Database Access**: Email verification requires database updates anyway

This approach provides excellent security while maintaining simplicity and revocability.

## Styling

The project uses `tailwindcss` for styling, along with plugins like `tailwindcss-animate` and `tw-animate-css` for animations.

### Custom Animation System

The application features a centralized animation system built on Tailwind CSS:

#### Custom Keyframes
```css
/* Located in tailwind.config.ts */
keyframes: {
  'fade-in-up': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  },
  'draw': {
    '0%': { strokeDashoffset: '20' },
    '100%': { strokeDashoffset: '0' }
  }
}
```

#### Animation Classes
```css
animation: {
  'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
  'draw': 'draw 0.8s ease-in-out forwards'
}
```

#### Usage Examples
```tsx
// Staggered animations with delays
<div className="animate-fade-in-up [animation-delay:0.3s] opacity-0">
  Content appears with smooth transition
</div>

// SVG path drawing animation
<path className="animate-draw [stroke-dasharray:20]" />
```

### Component Library

- **AnimatedCheckIcon**: Reusable success state component with celebration effects
- **Size Variants**: Small (12x12), Medium (16x16), Large (20x20) configurations
- **Layered Animations**: Combines ping, pulse, bounce, and draw animations for rich feedback

## Email Integration

The project uses `nodemailer` in combination with Resend for sending transactional emails. This setup allows for flexible email delivery and template management.

### Configuration

1. Install `nodemailer` and Resend:
   ```bash
   pnpm install nodemailer @resend/client
   ```

2. Set up environment variables in your `.env` file:
   ```env
   RESEND_API_KEY=your-resend-api-key
   EMAIL_FROM=your-email@example.com
   ```

3. Example usage:
   ```javascript
   import { mailer } from '@/app/lib/email';
   import { buildVerificationLink, generateSecureToken } from '@/app/lib/utils';

   // Generate secure verification token
   const verificationToken = generateSecureToken();
   
   // Build validated verification link
   const verificationLink = buildVerificationLink(verificationToken);

   const mailOptions = {
     from: process.env.EMAIL_FROM,
     to: 'recipient@example.com',
     subject: 'Email Verification - SplitShifts',
     html: `
       <h2>Verify Your Email</h2>
       <p>Click the link below to verify your email address:</p>
       <a href="${verificationLink}">Verify Email</a>
       <p>This link will expire in 24 hours.</p>
     `,
   };

   try {
     const info = await mailer.sendMail(mailOptions);
     // Handle successful email send
     return { success: true, messageId: info.messageId };
   } catch (error) {
     // Handle email send error appropriately
     throw new Error('Failed to send email');
   }
   ```

## Authentication & Navigation

### Complete Authentication System

The application features a comprehensive authentication system built with NextAuth.js and modern security practices:

#### **User Registration & Login**
- **Sign-Up Flow**: Multi-field registration with first name, last name, email, password, and confirmation
- **Login System**: Secure email/password authentication with optional 2FA verification
- **Form Validation**: Real-time client and server-side validation using Zod schemas
- **Error Handling**: Comprehensive error states with user-friendly feedback

#### **Password Management**
- **Password Reset**: Email-based password reset with secure token validation
- **Password Updates**: In-app password change functionality for authenticated users
- **Security Requirements**: Enforced password complexity with special characters and minimum length
- **Token Security**: Time-limited password reset tokens with automatic expiration

#### **Two-Factor Authentication (2FA)**
- **OTP Implementation**: Time-based One-Time Password using industry-standard algorithms
- **QR Code Setup**: Generate QR codes for popular authenticator apps (Google Authenticator, Authy, Microsoft Authenticator)
- **Multi-Step Login**: Conditional 2FA verification during login process
- **Dashboard Management**: Enable/disable 2FA from user dashboard with real-time setup
- **6-Digit Verification**: Secure OTP input component with accessibility features

#### **Session & Security**
- **Session Management**: Automatic session handling with NextAuth.js
- **Route Protection**: Authentication middleware for protected routes
- **Logout Functionality**: Clean logout with session termination
- **Security Headers**: CSRF protection and secure cookie handling
- **Password Hashing**: Secure password storage using bcrypt

### Smart Navigation System

The app implements an intelligent navigation system with conditional rendering:

#### **Route-Based Navigation**
- **Conditional Rendering**: Navigation automatically hides on authentication pages (`/login`, `/signup`, `/password-reset`, `/update-password`)
- **Secure Matching**: Uses `pathname.startsWith()` for precise route detection and security
- **Consistent UX**: Maintains navigation on all public pages while providing clean auth experiences
- **Performance Optimized**: Client-side route detection with minimal re-renders

#### **Component Architecture**

```typescript
// AppNavigation component automatically handles navbar visibility
export default function AppNavigation() {
  const pathname = usePathname();
  
  const authRoutes = ['/login', '/signup', '/password-reset', '/update-password'];
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route));

  return isAuthPage ? null : <LandingNav />;
}
```

### Authentication Components

#### **Form Components**
- **SignUpForm**: Complete registration form with validation
- **LoginForm**: Multi-step login with 2FA support
- **PasswordResetForm**: Email-based password reset request
- **UpdatePasswordForm**: Secure password change with token validation
- **TwoFactorAuthForm**: 2FA setup and management interface

#### **UI Components**
- **OTPInput**: Specialized 6-digit OTP input with keyboard navigation
- **LogoutButton**: Reusable logout component with error handling
- **AuthenticationCards**: Consistent card-based design for all auth flows

## License

All Rights Reserved

Copyright (c) 2024 Leo Daniels

All rights are reserved. No part of this software or its associated documentation files (the "Software") may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the author, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

## Contact

For any inquiries or feedback, please contact:

- Leo Daniels - [leodaniels@CaliforniaDev.com](mailto:leodaniels@californiadev.com)
- GitHub: [@CaliforniaDev](https://github.com/CaliforniaDev)

## Documentation

### 📚 Project Documentation

- **[Project Overview](docs/PROJECT_OVERVIEW.md)** - Complete project description, tech stack, and feature overview
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Detailed documentation of project structure and architectural decisions
- **[Dashboard Icons Guide](DASHBOARD_ICONS_GUIDE.md)** - Comprehensive usage guide for the dashboard icon system
- **[UI Components Documentation](UI_COMPONENTS.md)** - Detailed component API and usage examples
- **[Email Verification Improvements](EMAIL_VERIFICATION_IMPROVEMENT.md)** - Technical analysis of error handling improvements
- **[Git Protection Guide](GIT_PROTECTION_GUIDE.md)** - Workflow and branch protection documentation

### 📖 Additional Resources

- **[Security Guide](SECURITY.md)** - Security practices and token management
- **[Changelog](CHANGELOG.MD)** - Detailed version history and feature additions
- **Component Documentation** - Individual component guides within the codebase
