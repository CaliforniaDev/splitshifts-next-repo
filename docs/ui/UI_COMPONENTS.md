# UI Components Documentation

This document provides detailed descriptions, usage examples, and styling information for the reusable UI components in the SplitShifts application.

## Table of Contents

- [Button Component](#button-component)
  - [Props](#props)
  - [Example Usage](#example-usage)
- [LinkButton Component](#linkbutton-component)
  - [Props](#props)
  - [Example Usage](#example-usage)
- [SelectMenu Component](#selectmenu-component)
  - [Props](#selectmenu-props)
  - [Features](#selectmenu-features)
  - [Example Usage](#selectmenu-example-usage)
- [Input Component](#input-component)
  - [Props](#input-component-props)
  - [Example Usage](#input-component-example-usage)
- [AuthLayout Component](#authlayout-component)
  - [Features](#authlayout-features)
  - [Usage](#authlayout-usage)
- [Typography and Styling Guide](#typography-and-styling-guide)

---

## Button Component

The `Button` component is a reusable UI element that allows you to render buttons with various styles based on the `variant` prop and different sizes using the `size` prop. It also supports disabling the button and handling click events.

### LinkButton Props

- **`variant`** (optional, `string`): Defines the style variant of the button. It can be one of the following:
  - `'elevated'`: Renders a button with an elevated shadow and background color from `surface-container-low`.
  - `'filled'`: Renders a button with a solid primary background color and on-primary text color.
  - `'tonal'`: Renders a button with a secondary container background color and on-secondary container text color.
  - `'outlined'`: Renders a button with a border and primary text color.
  - `'text'`: Renders a button with only primary text color, without any background or border.

  **Default:** `'filled'`

- **`size`** (optional, `string`): Defines the size of the button. It can be one of the following:
  - `'xs'`: Extra small button (16px border radius, 8px active)
  - `'small'`: Small button (20px border radius, 8px active)
  - `'medium'`: Medium button (28px border radius, 12px active)
  - `'large'`: Large button (48px border radius, 16px active)
  - `'xl'`: Extra large button (68px border radius, 16px active)

  **Default:** `'small'`

- **`disabled`** (optional, `boolean`): If `true`, the button will be disabled and non-interactive. The button will not trigger any click events.

  **Default:** `false`

- **`loading`** (optional, `boolean`): Shows a loading spinner and disables the button.

  **Default:** `false`

- **`className`** (optional, `string`): Allows additional custom classes to be added to the button for further styling customization.

  **Default:** `''`

- **`onClick`** (optional, `function`): A callback function that is triggered when the button is clicked.

- **`children`** (optional, `ReactNode`): The content to display inside the button. This can be text, icons, or any other JSX elements.

  **Default:** `'Button'`

### Interactive States

#### Active Border Radius

- Border radius transitions to smaller value on press (300ms ease-out)
- Works for both keyboard (Enter/Space) and mouse clicks
- Size-specific values exported in `ACTIVE_BORDER_RADIUS` constant

#### State Layers

- **Hover**: 8% opacity overlay (via `before:` pseudo-element)
- **Focus**: 10% opacity overlay (keyboard navigation only with `focus-visible`)
- **Active**: Reduced border radius during press
- **Ripple Effects**: GPU-accelerated ripple animations with keyboard support

#### Keyboard Support

- Enter/Space keys trigger button action
- Centered ripple effects for keyboard interactions
- Key repeat protection prevents ripple spam
- Visual feedback matches mouse interactions

### Button Example Usage

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

### LinkButton Example Usage

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

---

## SelectMenu Component

The `SelectMenu` component is a Material Design 3 compliant dropdown menu with advanced interactions, spring animations, and full keyboard navigation support.

**Location**: `app/components/ui/inputs/select-menu.tsx`

### SelectMenu Props

- **`id`** (optional, `string`): Unique identifier for the select element.
- **`label`** (required, `string`): The label text displayed above the select.
- **`options`** (required, `SelectMenuOption[]`): Array of options with `value`, `label`, and optional `disabled` properties.
- **`value`** (optional, `string`): Controlled component value.
- **`defaultValue`** (optional, `string`): Uncontrolled component initial value.
- **`placeholder`** (optional, `string`): Placeholder text shown when no value is selected.
- **`name`** (optional, `string`): Form field name for form submissions.
- **`error`** (optional, `boolean`): Shows error state with red border and label.
- **`errorMessage`** (optional, `string`): Error message displayed below the select.
- **`supportingText`** (optional, `string`): Helper text displayed below the select.
- **`disabled`** (optional, `boolean`): Disables the select menu.
- **`className`** (optional, `string`): Additional CSS classes.
- **`onChange`** (optional, `(value: string) => void`): Callback fired when selection changes.
- **`onBlur`** (optional, `(e: FocusEvent) => void`): Callback fired when select loses focus.

### SelectMenu Features

#### Spring Animations

- Custom `expressive-fast-spatial` cubic-bezier (0.42, 1.67, 0.21, 0.9) timing function
- Menu grows with scaleY animation from top/bottom origin (350ms duration)
- Selected item checkmark slides in with synchronized animation
- Smooth, bouncy feel matching Material Design 3 motion principles

### Keyboard Navigation

- **Arrow Keys**: Navigate through options (skips disabled items, wraps around)
- **Enter/Space**: Select active option or open/close menu
- **Escape**: Close menu and clear keyboard navigation state
- **Active Overlay**: 10% opacity overlay appears only during keyboard navigation (not mouse clicks)
- **Auto-scroll**: Active item automatically scrolls to center with smooth behavior

### Visual Enhancements

- **Checkmark Icon**: Visual indicator for selected items
- **Rounded Scrollbar**: 8px width with rounded track and thumb matching menu border-radius
- **Focus States**: Label turns primary color, underline animates on keyboard focus
- **Smart Positioning**: Automatically opens upward or downward based on available space

### Accessibility

- Full ARIA attributes (`role="listbox"`, `aria-selected`, `aria-expanded`)
- Keyboard-only focus indicators (overlay only on arrow navigation)
- Screen reader support with proper labeling
- Disabled option handling

### SelectMenu Example Usage

```tsx
import SelectMenu from '@/app/components/ui/inputs/select-menu';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', disabled: true },
  { value: 'option3', label: 'Option 3' },
];

// Controlled SelectMenu
<SelectMenu
  label="Choose an option"
  options={options}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  supportingText="Select one option from the list"
/>

// Uncontrolled SelectMenu with error state
<SelectMenu
  label="Required field"
  options={options}
  defaultValue="option1"
  error={true}
  errorMessage="This field is required"
/>

// With React Hook Form
<SelectMenu
  label="Status"
  options={statusOptions}
  {...register('status')}
  error={!!errors.status}
  errorMessage={errors.status?.message}
/>
```

---

## Input Component

The `Input` component is a modern, reusable input field that supports labels, error messages, supporting text, and accessibility features. It manages focus and populated states to provide visual feedback and ensure accessibility compliance. This component replaces the legacy TextField component for better consistency and TypeScript support.

### Props {#input-component-props}

- **`label`** (`string`): The label for the input field.

- **`icon`** (`ReactNode`, optional): Optional icon rendered inside the input.

- **`iconPosition`** (`'start' | 'end'`, optional): Placement for the input icon.

  **Default:** `'start'`

- **`value`** (`string`, optional): The current value of the input field (for controlled components).

- **`defaultValue`** (`string`, optional): The default value of the input field (for uncontrolled components).

- **`error`** (`boolean | null`, optional): Indicates an error state.

  **Default:** `false`

- **`errorMessage`** (`string`, optional): Error message to display when there's an error.

  **Default:** `''`

- **`supportingText`** (`string`, optional): Optional supporting text displayed below the input field.

  **Default:** `''`

- **`disabled`** (`boolean`, optional): If `true`, the input field will be disabled and non-interactive.

  **Default:** `false`

- **`required`** (`boolean`, optional): If `true`, the input field is marked as required.

  **Default:** `false`

- **`className`** (`string`, optional): Additional CSS classes to apply to the input element.

  **Default:** `''`

- **`onChange`** (`function`, optional): Callback fired when the value of the input field changes.

- **`onBlur`** (`function`, optional): Callback fired when the input field loses focus.

- **`ref`** (`React.Ref<HTMLInputElement>`, optional): Ref to access the input element directly.

### Example Usage {#input-component-example-usage}

Here are some examples of how to use the `Input` component in your application:

```jsx
import Input from '@/app/components/ui/inputs/input';

function ExampleForm() {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    // Example validation
    if (e.target.value.length < 3) {
      setUsernameError('Username must be at least 3 characters long.');
    } else {
      setUsernameError('');
    }
  };

  return (
    <form>
      {/* Basic Input */}
      <Input
        label="Username"
        value={username}
        onChange={handleUsernameChange}
        supportingText="Enter your unique username."
        required
      />

      {/* Input with Error */}
      <Input
        label="Password"
        type="password"
        onChange={(e) => console.log(e.target.value)}
        error={true}
        errorMessage="Password must be at least 8 characters."
        required
      />

      {/* Disabled Input */}
      <Input
        label="Disabled Field"
        defaultValue="Cannot edit this"
        disabled
      />

      {/* Email Input */}
      <Input
        label="Email"
        type="email"
        onChange={(e) => console.log(e.target.value)}
        supportingText="We'll never share your email."
      />

      {/* Input with Icon */}
      <Input
        label="Search"
        type="text"
        icon={<SearchIcon className="h-5 w-5" />}
        iconPosition="start"
      />
    </form>
  );
}
```

## AuthLayout Component

The `AuthLayout` component provides a responsive layout system for authentication pages with optimized image loading and smooth transitions. It features automatic blur placeholder generation for improved perceived performance.

### Features {#authlayout-features}

- **Responsive Design**: Full-width form on mobile, split layout on desktop
- **Image Optimization**: Automatic blur placeholder generation using Sharp
- **Smooth Transitions**: CSS-based opacity transitions for seamless loading
- **Multiple Variants**: Default (50/50), Wide (60/40), and Compact (66/33) layouts
- **Server Component**: Async component that generates blur placeholders at build time
- **Customizable**: Support for custom images, layout direction, and overlays

### Usage {#authlayout-usage}

```jsx
import AuthLayout, { AuthLayoutWide, AuthLayoutCompact } from '@/app/components/ui/auth/auth-layout';

// Default 50/50 layout
<AuthLayout>
  <LoginForm />
</AuthLayout>

// Wide 60/40 layout for complex forms
<AuthLayoutWide imageSrc="/assets/custom-bg.webp">
  <SignupForm />
</AuthLayoutWide>

// Compact 66/33 layout for simple forms
<AuthLayoutCompact reverse={true}>
  <PasswordResetForm />
</AuthLayoutCompact>
```

**Key Props:**

- `imageSrc`: Custom image path (defaults to login side image)
- `reverse`: Switch form and image sides
- `showOverlay`: Control gradient overlay visibility
- `showLogo`: Toggle logo display in form section

For complete documentation, see [`README-AuthLayout.md`](./splitshifts-app/app/components/ui/auth/README-AuthLayout.md).

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

## Form Components & Dialog Integration

### React Hook Form with Radix Dialog

When using React Hook Form components inside Radix UI Dialog components, special attention must be paid to context management due to Dialog's portal rendering behavior.

#### Common Issue: Form Context Errors

**Error:** `Cannot destructure property 'getFieldState' of 'useFormContext()' as it is null`

**Cause:** Radix Dialog uses React portals which can break React context chains. If a Form component tries to render before the Dialog is mounted, the Form context won't be available.

**Solution:** Add an early return guard to prevent rendering Form components before the Dialog is fully mounted:

```tsx
import { Dialog, DialogContent, DialogTrigger } from '@/app/components/ui/dialog';
import { Form, FormField, FormControl, FormItem } from '@/app/components/ui/form';

export function MyFormModal({ isOpen, onClose }) {
  // Early return prevents Form from rendering outside Dialog context
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="fieldName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

**Key Pattern:**

- Always check modal/dialog open state before rendering Form components
- Use `if (!isOpen) return null;` at component start
- This ensures Form context is only accessed when Dialog portal is mounted

**Related Components:**

- `shift-form-modal.tsx` - Uses this pattern for shift creation
- `management-modal.tsx` - Uses this pattern for organization management

## Performance & Code Quality Standards

The SplitShifts component library follows modern performance optimization patterns:

- **Module-Level Computations**: All component variants use `clsx()` computations at module level to eliminate runtime overhead
- **Design Token Constants**: Magic numbers are extracted into semantic constants (e.g., `SVG_ICON_ACTIVE_STROKE_WIDTH`) for maintainability
- **Consistent Patterns**: All variant files use the same `clsx([...])` pattern for predictable code structure
- **CVA Integration**: Class Variance Authority (CVA) provides type-safe variant systems with optimal performance characteristics
- **Form Context Safety**: Early return guards prevent context errors in portal-rendered components

These optimizations ensure consistent performance across the application while maintaining clean, maintainable code.
