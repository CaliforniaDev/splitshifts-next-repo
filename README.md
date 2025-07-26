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

- None yet (project setup in progress)

### Planned Features

- User-friendly admin dashboard
- Manage upcoming shifts, appointments, and current events
- Set and view reminders for important tasks
- Real-time alerts for shift coverage and scheduling changes
- Employee availability summary
- Shift swap and schedule change request handling

## Technologies Used

- Next.js
- React.js
- Tailwind CSS
- Node.js
- MongoDB

## Services and Tools

This application leverages the following services and tools:

- **Neon Databases**: A modern cloud-based database solution for scalable and efficient data storage.
- **Drizzle ORM**: A lightweight TypeScript ORM for interacting with the database.
- **Resend.com**: A service for sending transactional emails and managing email templates.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MongoDB installed and running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CaliforniaDev/splitshifts-nextjs.git
   ```

2. Navigate to project directory:

   ```bash
   cd splitshifts-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

1. Start the development server:

   ```bash
   npm run dev
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

- `dev`: Start the development server.
- `dev:network`: Start the development server with network access.
- `build`: Build the application for production.
- `start`: Start the production server.
- `lint`: Run linting checks.

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
   npm install nodemailer @resend/client
   ```

2. Set up environment variables in your `.env` file:
   ```env
   RESEND_API_KEY=your-resend-api-key
   EMAIL_FROM=your-email@example.com
   ```

3. Example usage:
3. Example usage:
   ```javascript
   import nodemailer from 'nodemailer';
   import { Resend } from '@resend/client';

   const resend = new Resend(process.env.RESEND_API_KEY);

   const transporter = nodemailer.createTransporter({
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
   ```## License

All Rights Reserved

Copyright (c) 2024 Leo Daniels

All rights are reserved. No part of this software or its associated documentation files (the "Software") may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the author, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.

## Contact

For any inquiries or feedback, please contact:

- Leo Daniels - [leodaniels@CaliforniaDev.com](mailto:leodaniels@californiadev.com)
- GitHub: [@CaliforniaDev](https://github.com/CaliforniaDev)
