# Auth Layout Documentation

## Overview

The `AuthLayout` component provides a responsive layout system for authentication pages with an image on the left side and forms on the right side. It automatically adapts to different screen sizes and provides multiple layout variants for different use cases.

## Features

- **Responsive Design**: Full-width form on mobile, split layout on desktop
- **Multiple Variants**: Default (50/50), Wide (60/40), and Compact (66/33) layouts
- **Customizable Images**: Use any image with proper optimization
- **Flexible Direction**: Option to reverse layout (form left, image right)
- **Design System Integration**: Uses your existing Tailwind design tokens
- **Accessibility**: Proper image alt text and semantic structure

## Basic Usage

### Default Layout (50/50 split)

```tsx
import AuthLayout from '@/app/components/ui/auth/auth-layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
```

### Wide Layout (60/40 split)

```tsx
import { AuthLayoutWide } from '@/app/components/ui/auth/auth-layout';

export default function SignupPage() {
  return (
    <AuthLayoutWide>
      <SignupForm />
    </AuthLayoutWide>
  );
}
```

### Compact Layout (66/33 split)

```tsx
import { AuthLayoutCompact } from '@/app/components/ui/auth/auth-layout';

export default function PasswordResetPage() {
  return (
    <AuthLayoutCompact>
      <PasswordResetForm />
    </AuthLayoutCompact>
  );
}
```

## Customization Options

### Custom Image

```tsx
<AuthLayout
  imageSrc="/assets/custom-auth-image.jpg"
  imageAlt="Custom authentication background"
>
  <YourForm />
</AuthLayout>
```

### Reverse Layout

```tsx
<AuthLayout
  reverse={true}
  imageSrc="/assets/mockups/dashboard-dark.webp"
>
  <YourForm />
</AuthLayout>
```

### Custom Styling

```tsx
<AuthLayout
  className="bg-gradient-to-r from-primary to-secondary"
  imageSrc="/assets/branded-background.jpg"
>
  <YourForm />
</AuthLayout>
```

## Layout Variants

### AuthLayout (Default)
- **Desktop**: 50% image, 50% form
- **Mobile**: 100% form, no image
- **Best for**: Standard login, signup forms

### AuthLayoutWide
- **Desktop**: 60% image, 40% form
- **Mobile**: 100% form, no image  
- **Best for**: Complex forms with multiple fields

### AuthLayoutCompact
- **Desktop**: 66% image, 33% form
- **Mobile**: 100% form, no image
- **Best for**: Simple forms like password reset

## Responsive Breakpoints

| Screen Size | Behavior |
|-------------|----------|
| `< lg (1024px)` | Full-width form, no image |
| `>= lg (1024px)` | Split layout with image |

## Form Card Updates

When using the auth layouts, make sure your form cards use `w-full` instead of fixed widths:

```tsx
// ✅ Good - Responsive
<Card className="w-full shadow-elevation-0">

// ❌ Avoid - Fixed width
<Card className="w-[720px] shadow-elevation-0">
```

## Implementation in Your Project

### Option 1: Global Auth Layout

Update `app/(public)/(auth)/layout.tsx`:

```tsx
import AuthLayout from '@/app/components/ui/auth/auth-layout';

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout
      imageSrc="/assets/mockups/dashboard-light.webp"
      imageAlt="SplitShifts Dashboard Preview"
    >
      {children}
    </AuthLayout>
  );
}
```

### Option 2: Per-Page Layouts

For different images per page, wrap each form individually:

```tsx
// login/page.tsx
export default function LoginPage() {
  return (
    <AuthLayout imageSrc="/assets/login-bg.jpg">
      <LoginForm />
    </AuthLayout>
  );
}

// signup/page.tsx
export default function SignupPage() {
  return (
    <AuthLayoutWide imageSrc="/assets/signup-bg.jpg">
      <SignupForm />
    </AuthLayoutWide>
  );
}
```

## Image Optimization

- Use WebP format for better performance
- Provide multiple sizes for different screen densities
- Use `priority` prop for above-the-fold images
- Consider dark/light theme variants

## Best Practices

1. **Consistent Image Aspect Ratio**: Use images with similar aspect ratios across pages
2. **Alt Text**: Always provide descriptive alt text for accessibility
3. **Loading States**: Consider showing skeleton loaders while images load
4. **Theme Consistency**: Match image colors with your design system
5. **Content Readability**: Ensure form content is easily readable against the background

## Troubleshooting

### Form Too Wide
If your form appears too wide, ensure you're using `w-full` on the Card component and let the layout control the container width.

### Image Not Showing
1. Check the image path is correct relative to the `public` folder
2. Verify the image file exists
3. Check browser network tab for 404 errors

### Layout Not Responsive
Ensure you're using the `lg:` prefix for desktop-specific styles and that Tailwind's responsive breakpoints are working correctly.

## Migration Guide

If you're updating existing auth pages:

1. Remove wrapper `main` elements from page components
2. Update Card `className` from fixed widths to `w-full`
3. Add the AuthLayout to your auth layout file or individual pages
4. Update image paths to use your preferred auth background images

## Examples

See `auth-layout-examples.tsx` for complete implementation examples and additional customization options.
