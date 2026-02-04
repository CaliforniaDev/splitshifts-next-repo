# Time Picker Component

**Fully Refactored** | Material Design 3 | Production Ready

## Overview

A modular, maintainable time input component with dual modes (interactive dial and keyboard input), responsive behavior, and full accessibility support.

## Architecture

The component has been completely refactored from a monolithic 1361-line file into a clean, modular structure:

``` bash
time-picker/
├── index.tsx                    # Main component (~400 lines)
├── time-selector.tsx            # Hour/minute display component
├── period-selector.tsx          # AM/PM toggle component
├── clock-dial.tsx               # Interactive SVG clock face
├── use-manual-input.ts          # Manual input editing hook
├── use-clock-interaction.ts     # Clock interaction & dragging hook
├── constants.ts                 # Configuration & geometry
├── types.ts                     # TypeScript interfaces
├── utils.ts                     # Pure utility functions
└── README.md                    # Documentation
```

### Benefits of Refactoring

- ✅ **70% smaller** main component (400 lines vs 1361)
- ✅ **Testable** - isolated pure functions and hooks
- ✅ **Maintainable** - clear separation of concerns
- ✅ **Reusable** - components can be used independently
- ✅ **Type-safe** - comprehensive TypeScript interfaces
- ✅ **No breaking changes** - same public API

## Features

### Dual Input Modes

#### 1. Dial Mode

- Interactive SVG clock face with click/drag support
- Smooth animations with Material Design easing
- Visual feedback for selected values
- Auto-transition from hours to minutes

#### 2. Keyboard Mode

- Direct numeric input via TimeSelector components
- Auto-advance after 2 digits
- Compact layout for quick edits
- Toggle via keyboard icon button

### Responsive Behavior

- **Desktop (≥768px)**: Defaults to keyboard mode
- **Mobile (<768px)**: Defaults to dial mode
- **Dynamic**: Updates on screen resize/rotation
- **Manual toggle**: Switch modes anytime via button

### Input Methods

1. **Manual Input Field** (Primary)
   - Click-to-edit with segmented navigation
   - Format: `HH:MM AM`
   - Arrow keys, Space, Colon to navigate
   - Auto-formats and validates

2. **TimeSelector** (In Dialog)
   - Editable hour/minute displays
   - Material Design ripple effects
   - Active/focus visual states
   - Auto-focus on edit mode

3. **Clock Dial** (Visual)
   - Click numbers for instant selection
   - Drag for continuous adjustment
   - Animated hand movement
   - Hour → minute auto-transition

## Usage

### Basic Example

```tsx
import TimePicker from '@/app/components/ui/inputs/time-picker';

function MyForm() {
  const [time, setTime] = useState<Date | null>(null);

  return (
    <TimePicker
      label="Meeting Time"
      value={time}
      onChange={setTime}
    />
  );
}
```

### With Validation

```tsx
<TimePicker
  label="Start Time"
  value={startTime}
  onChange={setStartTime}
  error={hasError}
  errorMessage="Required field"
  required
/>
```

### Form Integration

```tsx
<FormField
  name="appointmentTime"
  control={form.control}
  render={({ field, fieldState }) => (
    <FormItem>
      <FormControl>
        <TimePicker
          label="Appointment Time *"
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

## Component API

### TimePicker Props

```typescript
interface TimePickerProps {
  label: string;                    // Input label
  value?: Date | null;              // Current time value
  onChange?: (date: Date | null) => void;  // Change handler
  onBlur?: () => void;              // Blur handler
  error?: boolean;                  // Error state
  errorMessage?: string;            // Error text
  supportingText?: string;          // Helper text
  disabled?: boolean;               // Disable input
  required?: boolean;               // Required field
  className?: string;               // Additional classes
  iconPosition?: 'start' | 'end';   // Icon placement
}
```

## Technical Details

### Architecture Patterns

1. **Composition over Inheritance**
   - Main component orchestrates smaller, focused components
   - Each component has a single responsibility
   - Props drilling minimized via hooks

2. **Custom Hooks for Logic**
   - `useManualInput`: Segmented input editing logic
   - `useClockInteraction`: Mouse/drag interaction handling
   - Separates UI from business logic

3. **Pure Functions for Calculations**
   - Angle calculations
   - Coordinate transformations
   - Time validation
   - All testable without React

4. **Type Safety**
   - Comprehensive TypeScript interfaces
   - Exported types for consumers
   - Strict null checking

### Performance Optimizations

- **Lazy state initialization**: Avoids unnecessary calculations on render
- **useCallback for event handlers**: Prevents unnecessary re-renders
- **Refs for stale closures**: Ensures event handlers have latest values
- **Conditional rendering**: Clock dial only renders when visible
- **CSS transitions**: Hardware-accelerated animations

### Animation System

- **Material Design easing**: `emphasizedDecelerate` for natural motion
- **Global utilities**: Consistent timing via Tailwind config
- **Nested animations**: Dialog height, dial scale/opacity, icon crossfade
- **60fps smooth**: CSS transforms for performant animations

### Accessibility

- **ARIA labels**: All interactive elements properly labeled
- **Keyboard navigation**: Full keyboard support (Tab, Enter, Arrows, Space)
- **Focus management**: Logical focus order, visible focus indicators
- **Screen readers**: Semantic HTML and proper ARIA roles
- **Touch targets**: 48px minimum for all clickable elements

## Customization

### Constants

Edit `/constants.ts` to customize:

```typescript
// Clock geometry
CLOCK_CONSTANTS.DIAMETER = 256;
CLOCK_CONSTANTS.NUMBER_RADIUS = 102;

// Animation timing
ANIMATION_CONSTANTS.TRANSITION_TO_MINUTES_DURATION = 250;
ANIMATION_CONSTANTS.TRANSITION_STEPS = 20;

// Responsive breakpoint
DESKTOP_BREAKPOINT = '(min-width: 768px)';
```

### Styling

The component uses Tailwind classes and Material Design tokens:

- **Colors**: `text-on-surface`, `bg-primary-container`, etc.
- **Typography**: `typescale-display-large`, `typescale-body-medium`
- **Elevation**: `shadow-elevation-3`
- **Motion**: `motion-expressive-default`, `long-ease-emphasized-decelerate`

Override via `className` prop or global CSS.

## Testing

### Unit Tests (Recommended)

Test individual components and utilities:

```typescript
import { getAngle, angleToHour, emphasizedDecelerate } from './utils';

describe('Time Picker Utils', () => {
  it('calculates angle correctly', () => {
    expect(getAngle(12, 12)).toBe(270); // 12 o'clock = -90° = 270°
  });

  it('converts angle to hour', () => {
    expect(angleToHour(270)).toBe(12);
  });

  it('easing function returns 0-1 range', () => {
    expect(emphasizedDecelerate(0)).toBe(0);
    expect(emphasizedDecelerate(1)).toBe(1);
  });
});
```

### Integration Tests

Test user interactions:

```typescript
import { render, fireEvent } from '@testing-library/react';
import TimePicker from './index';

it('opens dialog on icon click', () => {
  const { getByLabelText, getByText } = render(
    <TimePicker label="Time" value={null} onChange={jest.fn()} />
  );
  
  fireEvent.click(getByLabelText('Open time picker'));
  expect(getByText('Select time')).toBeInTheDocument();
});
```

## Migration from Old Version

If you're upgrading from the monolithic version (time-picker.tsx), the public API is **unchanged**:

```tsx
// Old import (still works)
import TimePicker from '@/app/components/ui/inputs/time-picker';

// New import (recommended)
import TimePicker from '@/app/components/ui/inputs/time-picker';

// Usage is identical
<TimePicker label="Time" value={time} onChange={setTime} />
```

The old file has been preserved as `time-picker-old.tsx` for reference.

## Troubleshooting

### Dialog doesn't open on desktop

- Check that `DESKTOP_BREAKPOINT` matches your breakpoint (default: 768px)
- Verify `disabled` prop is not set to `true`

### Animations feel slow/fast

- Adjust `ANIMATION_CONSTANTS` in `constants.ts`
- Check for CSS conflicts overriding transition durations

### TypeScript errors

- Ensure `@/app/lib/utils/time` exports all required utilities
- Verify `@/app/components/ui/icons` exports `ClockIcon` and `KeyboardIcon`

### Manual input not working

- Verify `formatTime`, `validateHours`, `validateMinutes` are correctly imported
- Check browser console for JavaScript errors

## Performance Considerations

- **Component size**: ~400 lines main component + ~800 lines support files = 1200 total (vs 1361 monolithic)
- **Bundle size**: No impact - same code, better organized
- **Render performance**: Improved via custom hooks and useCallback
- **Runtime performance**: Identical to previous version

## Future Improvements

Potential enhancements (not currently implemented):

- **24-hour format option**: Add prop for 24-hour time display
- **Minute intervals**: Configurable minute increments (5, 10, 15, 30)
- **Time range validation**: Min/max time constraints
- **Storybook stories**: Component documentation and variants
- **Unit test coverage**: Comprehensive test suite
- **Lazy loading**: Code-split dial mode for faster initial load

## Contributing

When modifying the time picker:

1. **Keep components small**: Single responsibility principle
2. **Test utilities**: All pure functions should have unit tests
3. **Document changes**: Update README and inline JSDoc comments
4. **Type everything**: No `any` types, strict TypeScript
5. **Maintain public API**: Don't break existing usage patterns

---

**Questions?** Check the inline JSDoc comments in each file for detailed documentation of functions and components.
