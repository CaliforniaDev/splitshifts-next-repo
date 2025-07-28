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
- [Styling](#styling)
- [Email Integration](#email-integration)

## Features

### Implemented Features

- **Complete Authentication System**: Full-featured user authentication with secure registration, login, and session management
  - **User Registration**: Sign-up form with first name, last name, email, password validation and confirmation
  - **Secure Login**: Multi-step login process with email/password authentication
  - **Password Reset Flow**: Email-based password reset with secure token validation
  - **Password Updates**: Secure password change functionality for authenticated users
  - **Session Management**: Automatic session handling with NextAuth.js integration
- **Two-Factor Authentication (2FA)**: Enterprise-grade security with TOTP support
  - **QR Code Setup**: Generate QR codes for authenticator apps (Google Authenticator, Authy, etc.)
  - **6-Digit OTP Verification**: Secure time-based one-time password validation
  - **2FA Management**: Enable/disable 2FA from user dashboard
  - **Multi-Step Login**: Conditional 2FA verification during login process
- **Conditional Navigation**: Smart navigation component that automatically hides the navbar on authentication pages while preserving it on public pages
- **Responsive UI Components**: Comprehensive component library with consistent styling
  - **Reusable Forms**: Button, input, card, and form components with validation
  - **OTP Input Component**: Specialized 6-digit OTP input with accessibility features
  - **Authentication Cards**: Consistent card-based design for all auth flows
- **Advanced Form Validation**: Real-time validation using Zod schemas
  - **Client-side Validation**: Immediate feedback on form inputs
  - **Server-side Validation**: Secure validation of all authentication data
  - **Error Handling**: Comprehensive error states and user feedback
- **Email Integration**: Transactional email support for password resets and notifications
- **Database Integration**: PostgreSQL with Drizzle ORM for secure user data storage
- **Security Features**: 
  - **Password Hashing**: Secure password storage with bcrypt
  - **Token-based Reset**: Secure password reset tokens with expiration
  - **Route Protection**: Authentication middleware for protected routes
  - **Session Security**: Secure session management and CSRF protection
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

## Database

The project integrates with Neon using `@neondatabase/serverless` and `drizzle-orm` for database management.

## Styling

The project uses `tailwindcss` for styling, along with plugins like `tailwindcss-animate` and `tw-animate-css` for animations.

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
   import nodemailer from 'nodemailer';
   import { Resend } from '@resend/client';

   const resend = new Resend(process.env.RESEND_API_KEY);

   const transporter = nodemailer.createTransporter({
   const transporter = nodemailer.createTransport({
     service: 'Resend',
     auth: {
       api_key: process.env.RESEND_API_KEY,
     },
   });
   const mailOptions = {
     from: process.env.EMAIL_FROM,
     to: 'recipient@example.com',
     subject: 'Test Email',
     text: 'This is a test email sent using Resend and Nodemailer.',
   };

   try {
     const info = await transporter.sendMail(mailOptions);
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
- **TOTP Implementation**: Time-based One-Time Password using industry-standard algorithms
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
