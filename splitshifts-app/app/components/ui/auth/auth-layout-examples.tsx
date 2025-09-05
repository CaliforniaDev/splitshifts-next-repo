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