# UI Components Documentation

This document provides detailed descriptions, usage examples, and styling information for the reusable UI components in the SplitShifts application.

## Table of Contents
- [Button Component](#button-component)
  - [Props](#props)
  - [Example Usage](#example-usage)
  - [Styling](#styling)
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
import Button from '@/app/components/Button';

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
