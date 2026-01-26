# Onboarding Module

A complete, modular onboarding wizard system with clean architecture and reusable components.

## Architecture

### 📁 Folder Structure

```text
onboarding/
├── components/           # UI Components
│   ├── index.ts         # Component exports
│   ├── completion-card.tsx
│   ├── form-layout.tsx  # Shared form wrapper
│   ├── organization-form.tsx
│   ├── placeholder-card.tsx
│   ├── step-progress.tsx
│   ├── welcome-card.tsx
│   └── worksite-form.tsx
├── constants/           # Shared constants & variants
│   └── index.ts
├── hooks/              # Custom hooks
│   └── use-form-submission.ts
├── types/              # TypeScript definitions
│   └── onboarding-types.ts
├── index.ts            # Main module exports
└── README.md
```

### 🎯 Design Principles

1. **Self-Contained Forms**: Each form manages its own state, validation, and API calls
2. **Clean Interfaces**: Simple `onSuccess/onBack` callbacks for wizard coordination
3. **Shared Constants**: Single source of truth for step configuration and styling
4. **Reusable Components**: Form layouts and cards can be used across different contexts
5. **TypeScript First**: Full type safety with proper interfaces

### 🔄 Data Flow

```text
OnboardingWizard (Step Management)
    ↓ onSuccess/onBack callbacks
Individual Forms (Self-Contained)
    ↓ API calls & validation
Backend Services
```

## Components

### Core Components

- **OnboardingWizard**: Main coordinator component
- **StepProgress**: Visual progress indicator
- **WelcomeCard**: Initial welcome screen with step preview

### Form Components

- **OrganizationForm**: Self-contained organization creation
- **WorksiteForm**: Self-contained worksite creation with timezone support
- **PlaceholderCard**: Placeholder for future form steps

### Utility Components

- **FormLayout**: Shared form wrapper component
- **CompletionCard**: Success completion screen

## Usage

### Basic Import

```tsx
import {
  WelcomeCard,
  OrganizationForm,
  WorksiteForm,
  OnboardingStep
} from './onboarding';
```

### Form Pattern

```tsx
<OrganizationForm
  onSuccess={() => setStep(OnboardingStep.WORKSITE)}
  onBack={() => setStep(OnboardingStep.WELCOME)}
/>

// Skip button bypasses validation
<Button variant="text" onClick={onSuccess}>
  Skip for Now
</Button>
```

### Progress Persistence

```tsx
// Server action saves progress
export async function saveOnboardingProgress(step: string | null) {
  'use server';
  const session = await requireAuth();
  await db.update(users)
    .set({ onboardingStep: step })
    .where(eq(users.id, session.user.id!));
}

// Dashboard resumes from saved step
const [user] = await db.select({ onboardingStep: users.onboardingStep })
  .from(users)
  .where(eq(users.id, session.user.id!));

if (!userOrg || user?.onboardingStep) {
  return <OnboardingWizard initialStep={user?.onboardingStep} />;
}
```

## Features

✅ **Self-contained forms** with internal state management  
✅ **Progress persistence** with database state tracking  
✅ **Auto-save navigation** via server actions  
✅ **Skip functionality** with validation bypass  
✅ **Resume capability** after page refresh or logout  
✅ **Proper timezone support** with @vvo/tzdb integration  
✅ **Material Design 3** styling with CVA variants  
✅ **Button hierarchy** with filled/outlined/tonal/text variants  
✅ **TypeScript** interfaces and type safety  
✅ **Accessibility** with proper ARIA labels  
✅ **Error handling** with form-level error states  
✅ **Loading states** with proper UI feedback  
✅ **Responsive design** with mobile-first approach

## Extending

### Adding New Steps

1. Create form component in `components/`
2. Add step to `OnboardingStep` enum
3. Add step configuration to `STEP_DISPLAY_CONFIG`
4. Implement in main wizard with same callback pattern

### Custom Hooks

- Use `useFormSubmission` for consistent API handling
- Add new hooks in `hooks/` directory
- Export through main index file
