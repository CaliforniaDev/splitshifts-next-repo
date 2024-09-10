# UI Components Documentation

This document provides detailed descriptions, usage examples, and styling information for the reusable UI components in the SplitShifts application.

## Table of Contents
- [Button Component](#button-component)
  - [Props](#props)
  - [Example Usage](#example-usage)
- [LinkButton Component](#linkbutton-component)
  - [Props](#props)
  - [Example Usage](#example-usage)
- [Typography and Styling Guide](#typography-and-styling-guide)
- [Additional Components](#additional-components)

---

## Button Component

The `Button` component is a reusable UI element that allows you to render buttons with various styles based on the `variant` prop and different sizes using the `size` prop. It also supports disabling the button and handling click events.

### Props

- **`variant`** (optional, `string`): Defines the style variant of the button. It can be one of the following:
  - `'elevated'`: Renders a button with an elevated shadow and background color from `surface-container-low`.
  - `'filled'`: Renders a button with a solid primary background color and on-primary text color.
  - `'tonal'`: Renders a button with a secondary container background color and on-secondary container text color.
  - `'outlined'`: Renders a button with a border and primary text color.
  - `'text'`: Renders a button with only primary text color, without any background or border.

  **Default:** `'filled'`

- **`size`** (optional, `string`): Defines the size of the button. It can be one of the following:
  - `'default'`: Renders a button with standard padding and typographic scale.
  - `'large'`: Renders a button with larger padding and a prominent typographic scale.

  **Default:** `'default'`

- **`disabled`** (optional, `boolean`): If `true`, the button will be disabled and non-interactive. The button will not trigger any click events.

  **Default:** `false`

- **`className`** (optional, `string`): Allows additional custom classes to be added to the button for further styling customization.

  **Default:** `''`

- **`onClick`** (optional, `function`): A callback function that is triggered when the button is clicked.

- **`children`** (optional, `ReactNode`): The content to display inside the button. This can be text, icons, or any other JSX elements.

  **Default:** `'Button'`

### Example Usage

Here are some examples of how to use the `Button` component in your application:

```jsx
import Button from '@/app/components/ui/buttons/button';

// Elevated Button
<Button variant="elevated" onClick={() => console.log('Elevated Button clicked!')}>
  Elevated Button
</Button>

// Filled Button
<Button variant="filled" onClick={() => console.log('Filled Button clicked!')}>
  Filled Button
</Button>

// Tonal Button
<Button variant="tonal" onClick={() => console.log('Tonal Button clicked!')}>
  Tonal Button
</Button>

// Outlined Button
<Button variant="outlined" onClick={() => console.log('Outlined Button clicked!')}>
  Outlined Button
</Button>

// Text Button
<Button variant="text" onClick={() => console.log('Text Button clicked!')}>
  Text Button
</Button>

// Large Filled Button
<Button variant="filled" size="large" onClick={() => console.log('Large Filled Button clicked!')}>
  Large Filled Button
</Button>

// Disabled Button
<Button variant="filled" disabled onClick={() => console.log('This should not log')}>
  Disabled Button
</Button>
```

## LinkButton Component

The `LinkButton` component is similar to the `Button` component but is used for navigation. It renders a styled `<a>` tag using Next.js's `Link` component, offering the same styling and flexibility as the `Button`.

### Props

- **`href`** (required, `string`): Defines the URL to which the link should navigate. It must be a valid URL string.
  
- **`variant`** (optional, `string`): Defines the style variant of the button. It can be one of the following:
  - `'elevated'`: Renders a link with an elevated shadow and background color from `surface-container-low`.
  - `'filled'`: Renders a link with a solid primary background color and on-primary text color.
  - `'tonal'`: Renders a link with a secondary container background color and on-secondary container text color.
  - `'outlined'`: Renders a link with a border and primary text color.
  - `'text'`: Renders a link with only primary text color, without any background or border.

  **Default:** `'filled'`

- **`size`** (optional, `string`): Defines the size of the button link. It can be one of the following:
  - `'default'`: Renders a link with standard padding and typographic scale.
  - `'large'`: Renders a link with larger padding and a prominent typographic scale.

  **Default:** `'default'`

- **`children`** (optional, `ReactNode`): The content to display inside the link. This can be text, icons, or any other JSX elements.

  **Default:** `'Button'`

- **`className`** (optional, `string`): Allows additional custom classes to be added to the link for further styling customization.

  **Default:** `''`

- **`rest`** (optional, `object`): Additional props that are passed to the underlying `Link` component from Next.js.

### Example Usage

Here are some examples of how to use the `LinkButton` component in your application:

```jsx
import LinkButton from '@/app/components/ui/buttons/LinkButton';

// Text Link
<LinkButton href="/login" variant="text">
  Log In
</LinkButton>

// Filled Link
<LinkButton href="/signup" variant="filled">
  Start for free
</LinkButton>

// Tonal Link
<LinkButton href="/learn-more" variant="tonal">
  Learn More
</LinkButton>

// Large Filled Link
<LinkButton href="/signup" size="large" variant="filled">
  Start for free
</LinkButton>
```

## Typography and Styling Guide

This section outlines the custom type scale defined using Tailwind CSS for consistent typography across the SplitShifts web application. The type scale is carefully categorized into Display, Headline, Title, Label, and Body fonts, each offering variations in size, weight, and letter spacing to maintain a cohesive design.

### Type Scale Overview

- **Display Fonts:** 
  - Used for large, prominent text elements.
  - Font: **Inter**, Weight: **800**, with varying sizes (Large, Medium, Small).

- **Headline Fonts:**
  - Suitable for headlines and section titles.
  - Font: **Space Grotesk**, Weight: **450** for differentiation from Display fonts.

- **Title Fonts:**
  - Applied to smaller, significant text elements like titles and subtitles.
  - Font: **Inter**, Weight: **500** with a more prominent variant available.

- **Label Fonts:**
  - Utilized for form labels and UI elements requiring clarity.
  - Font: **Inter**, Weights: **500** and **600** (prominent variant).

- **Body Fonts:**
  - Intended for body text across the application.
  - Font: **Inter**, Weight: **400** for readability.

### Tailwind's @layer Feature

- **@layer base:** 
  - This layer is where the type scale classes are defined, applying the corresponding font family, weight, size, and letter spacing. It ensures typography remains consistent across all components in the application.

### Usage

- **Typography**: Use the classes defined in `typography.css` to apply consistent typography styles.
- **Tailwind Configuration**: Customize the theme in `tailwind.config.ts` to match the design requirements.
- **Fonts**: Define and use custom fonts in `fonts.ts`.
- **Layout**: Apply the defined styles in `layout.tsx`.

### Example Usage

- Apply classes such as `.typescale-display-large`, `.typescale-headline-medium`, `.typescale-title-small`, etc., directly to HTML elements to ensure they adhere to the defined type scale.

