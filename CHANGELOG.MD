# Changelog

## [Unreleased]

### Added
- Set up the initial project structure for the SplitShifts application.
- Configured Next.js with TypeScript for type-safe development.
- Integrated Tailwind CSS for utility-first styling.
- Established a custom type scale using Tailwind CSS for consistent typography.
- Defined base utility styles and variables (e.g., colors, spacing) to be used across the application.
- Implemented basic folder structure for components, pages, and styles.
- Integrated ESLint and Prettier for code linting and formatting.
- **Button Component**: Implemented a reusable `Button` component with support for different variants (`elevated`, `filled`, `tonal`, `outlined`, `text`) and sizes (`default`, `large`). The component also supports disabling and custom styling through the `className` prop.
- **LinkButton Component**: Added a `LinkButton` component that renders a styled link resembling a button. It supports the same variants (`elevated`, `filled`, `tonal`, `outlined`, `text`) and sizes (`default`, `large`) as the `Button` component for consistent styling in navigation.
- **TopNav Component**: Styled the `TopNav` component and replaced the buttons with `LinkButton` components for navigation ("Log In" and "Start for free"). The component is functional but not yet fully reusable.
- **Hero Section**: Added a Hero section with a headline, subheadline, and a call-to-action button.
- **TextField Component**: Implemented a reusable `TextField` component with support for labels, error messages, supporting text, and accessibility features. The component manages focus and populated states and allows custom styling through the `className` prop.
- **README Updates**: Documented key dependencies, development tools, scripts, environment variables, database integration, and styling.
- **Table of Contents**: Updated the README to include new sections for better navigation.
- **Environment Variables**: Added documentation for managing environment variables using `dotenv`.
- **Database Integration**: Documented the integration of Neon and Drizzle ORM for database management.
- **Styling Enhancements**: Added documentation for TailwindCSS plugins (`tailwindcss-animate`, `tw-animate-css`) and their usage.
- **Update Password Form**: Refactored the `update-password-form.tsx` to improve readability, separate form fields, and enhance prop naming.
- **Validation Schema**: Added `update-password-schema.ts` for validating the update password form using Zod.
- **Custom Hook**: Implemented `use-update-password-form.ts` to manage form state and validation logic.
- **Type Definitions**: Added `update-password-form-data.ts` to define types for the update password form.
- **Error Handling**: Improved error handling and user feedback for the update password functionality.
- **Authentication Middleware**: Implemented middleware for handling authentication and session management (`middleware.ts`).
- **API Routes**: Added `auth/[...nextauth]/route.ts` for managing authentication-related API endpoints.
- **Tailwind Configuration**: Enhanced `tailwind.config.ts` with custom themes, typography settings, and utility classes.
- **Global Styles**: Added `globals.css` for consistent styling across the application.
- **Reusable UI Components**: Added components like `card.tsx`, `form.tsx`, `label.tsx`, and `button.tsx` for consistent UI design.
- **Toast Notifications**: Implemented `react-toast` for user feedback and notifications.
- **Experimental Features**: Added experimental components like `RippleButton.tsx` and `button-group.tsx` for testing new UI designs.
- **Database Schema**: Defined schemas for users and password reset tokens in `usersSchema.ts` and `passwordResetTokenSchema.ts`.
- **Hero Section**: Created a reusable `hero-section.tsx` component for the landing page.
- **Custom Fonts**: Integrated custom fonts and typography settings using `fonts.ts` and `typography.css`.

### Changed
- Extracted shared Tailwind CSS styles for `Button` and `LinkButton` components into a separate file (`buttonStyles.ts`) to ensure consistency and reusability across both components.
- **Folder Structure**: Organized the app into `(public)` and `(logged-in)` sections for better separation of concerns.
- **Component Refactoring**: Improved the structure and readability of reusable components like `Button` and `TextField`.
- **Error Handling**: Enhanced error handling across API routes and form submissions.

### Fixed
- **Accessibility**: Improved accessibility features in form components and navigation elements.
- **Peer Dependency Warnings**: Resolved peer dependency issues for `nodemailer` and other packages.
