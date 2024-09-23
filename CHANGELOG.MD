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

### Changed
- Extracted shared Tailwind CSS styles for `Button` and `LinkButton` components into a separate file (`buttonStyles.ts`) to ensure consistency and reusability across both components.

### Fixed
- N/A
