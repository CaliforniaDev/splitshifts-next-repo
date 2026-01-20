# Buttons Folder Structure

This folder contains all button component types following Material Design 3 specifications.

## Structure

```
buttons/
├── button/           # Standard button component
│   ├── button.tsx    # Button component implementation
│   ├── variants.ts   # CVA variants for standard buttons
│   └── index.ts      # Exports for button module
├── shared.ts         # Shared utilities across all button types
└── index.ts          # Root exports for all button types
```

## Adding New Button Types

When adding new button types (IconButton, FAB, etc.):

1. **Create a new subfolder** (e.g., `icon-button/`, `fab/`)
2. **Add component file** (e.g., `icon-button.tsx`)
3. **Add variants file** (e.g., `variants.ts`) - import from `../shared.ts`
4. **Create subfolder index** to export component and types
5. **Update root index.ts** to export the new button type

### Example: Adding IconButton

```typescript
// buttons/icon-button/icon-button.tsx
import { baseButtonClasses, stateLayer } from '../shared';

// buttons/icon-button/variants.ts
import { cva } from 'class-variance-authority';
import { baseButtonClasses, stateLayer, disabledState } from '../shared';

export const iconButtonVariants = cva(baseButtonClasses, {
  // Your variants...
});

// buttons/icon-button/index.ts
export { default as IconButton } from './icon-button';
export { iconButtonVariants } from './variants';

// buttons/index.ts
export { IconButton } from './icon-button';
```

## Shared Utilities

The `shared.ts` file contains:
- `baseButtonClasses` - Common layout, hover overlays, focus states
- `stateLayer` - Material Design 3 state layer opacity values
- `disabledState` - Consistent disabled styling
- `ACTIVE_BORDER_RADIUS` - Active state border radius per size

All button types should import these to maintain consistency.

## Import Pattern

```typescript
// ✅ Recommended - Use index exports
import { Button } from '@/app/components/ui/buttons';
import { Button, type ButtonProps } from '@/app/components/ui/buttons';

// ✅ Also valid - Direct path
import { Button } from '@/app/components/ui/buttons/button';

// ❌ Avoid - Don't import from deep paths
import Button from '@/app/components/ui/buttons/button/button';
```
