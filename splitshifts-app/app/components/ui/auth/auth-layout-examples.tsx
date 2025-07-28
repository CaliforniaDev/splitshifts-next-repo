/**
 * AuthLayout Usage Examples
 * 
 * This file demonstrates how to use the different AuthLayout variants
 * for various authentication forms and scenarios.
 */

import AuthLayout, { AuthLayoutWide, AuthLayoutCompact } from './auth-layout';

// Example: Default 50/50 layout (recommended for most forms)
export function DefaultAuthExample({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}

// Example: Wide layout (60/40 split - good for complex forms)
export function WideAuthExample({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayoutWide>
      {children}
    </AuthLayoutWide>
  );
}

// Example: Compact layout (66/33 split - good for simple forms)
export function CompactAuthExample({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayoutCompact>
      {children}
    </AuthLayoutCompact>
  );
}

// Example: Custom image with reverse layout
export function CustomImageExample({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout
      imageSrc="/assets/mockups/dashboard-dark.webp"
      imageAlt="SplitShifts Dark Theme Dashboard"
      reverse={true}
    >
      {children}
    </AuthLayout>
  );
}

// Example: Login-specific layout
export function LoginLayoutExample({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout
      imageSrc="/assets/mockups/dashboard-light.webp"
      imageAlt="Welcome to SplitShifts - Manage your shifts efficiently"
    >
      {children}
    </AuthLayout>
  );
}

// Example: Signup-specific layout with different image
export function SignupLayoutExample({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayoutWide
      imageSrc="/assets/mockups/dashboard-dark.webp"
      imageAlt="Join SplitShifts - Start managing your team today"
    >
      {children}
    </AuthLayoutWide>
  );
}

/**
 * How to customize the layout in your auth pages:
 * 
 * 1. Replace the default layout in (auth)/layout.tsx:
 * 
 * import AuthLayout from '@/app/components/ui/auth/auth-layout';
 * 
 * export default function AuthPagesLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <AuthLayout
 *       imageSrc="/your-custom-image.jpg"
 *       imageAlt="Your custom description"
 *       reverse={false} // or true to swap sides
 *     >
 *       {children}
 *     </AuthLayout>
 *   );
 * }
 * 
 * 2. Or customize per page by wrapping individual forms:
 * 
 * export default function LoginPage() {
 *   return (
 *     <AuthLayoutCompact imageSrc="/login-specific-image.jpg">
 *       <LoginForm />
 *     </AuthLayoutCompact>
 *   );
 * }
 * 
 * 3. Available layout variants:
 * - AuthLayout: 50/50 split (default)
 * - AuthLayoutWide: 60/40 split (image larger)
 * - AuthLayoutCompact: 66/33 split (form smaller)
 * 
 * 4. Responsive behavior:
 * - Mobile: Full width form, no image
 * - Tablet: Full width form, no image  
 * - Desktop (lg+): Split layout with image
 */
