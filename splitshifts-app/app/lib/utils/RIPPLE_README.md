# Ripple Effect System

A reusable, centralized ripple effect system for SplitShifts components with GPU-accelerated animations, implementing Material Design 3 specifications.

## Overview

The ripple system provides smooth, touch-responsive interaction feedback that can be easily added to any interactive component in the application. It includes:

- **`useRipple` hook**: State management and event handlers
- **`RippleEffect` component**: Renders individual ripple animations with hardware acceleration
- **`RippleKeyframes` component**: Generates CSS animations
- **Utility functions**: Size calculations and helpers

## Performance Features

- ✅ GPU-accelerated animations using `transform` and `opacity`
- ✅ Hardware acceleration with `will-change` and `backface-visibility`
- ✅ Layer optimization with `transform-style: preserve-3d`
- ✅ Automatic memoization via React 19 Compiler
- ✅ Optimized event handlers with `useCallback`
- ✅ Industry-standard timing (550ms expand + 550ms fade, following MD3 specifications)

## Quick Start

```tsx
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';

function MyComponent() {
  // 1. Configure ripple behavior
  const rippleConfig: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: false,
  };

  const mergedConfig = { ...RIPPLE_DEFAULTS, ...rippleConfig, disabled: false };

  // 2. Use the hook
  const { ripples, rippleRef, handleMouseDown, handleMouseUp, handleKeyDown, handleKeyUp, removeRipple } =
    useRipple(rippleConfig);

  // 3. Attach to element
  return (
    <button
      ref={rippleRef as any}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onKeyDown={handleKeyDown}      // Keyboard support
      onKeyUp={handleKeyUp}           // Keyboard support
      className='relative overflow-hidden'
    >
      Click me

      {/* 4. Render ripples */}
      {ripples.map((ripple) => (
        <RippleEffect
          key={ripple.id}
          {...ripple}
          config={mergedConfig}
          keyframeName='MyComponent'
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}

      {/* 5. Add keyframes */}
      <RippleKeyframes name='MyComponent' config={mergedConfig} />
    </button>
  );
}
```

## Configuration Options

### RippleConfig

```typescript
interface RippleConfig {
  /** Duration of the expand animation in milliseconds (default: 550) */
  expandDuration?: number;

  /** Duration of the fade animation in milliseconds (default: 550) */
  fadeDuration?: number;

  /** Opacity of the ripple effect, 0-1 (default: 0.1) */
  opacity?: number;

  /** Color of the ripple (default: 'currentColor') */
  color?: string;

  /** Easing function (default: emphasized easing curve) */
  easing?: string;

  /** Disabled state - when true, ripple won't trigger */
  disabled?: boolean;
}
```

### Defaults

```typescript
export const RIPPLE_DEFAULTS = {
  expandDuration: 550,
  fadeDuration: 550, // Optimal timing for smooth user interaction
  opacity: 0.1,
  color: 'currentColor',
  easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)', // Emphasized easing curve
  disabled: false,
};
```

## Performance Optimizations

### GPU Acceleration

The ripple system uses several techniques to ensure buttery-smooth 60fps animations:

1. **`will-change: transform, opacity`**: Pre-optimizes properties before animation
2. **`backface-visibility: hidden`**: Forces hardware acceleration and prevents sub-pixel rendering
3. **`transform-style: preserve-3d`**: Creates 3D rendering context for better GPU utilization
4. **Transform & opacity only**: Uses only GPU-accelerated CSS properties
5. **`pointer-events: none`**: Prevents unnecessary event handling overhead

### React Optimizations

- **React 19 Compiler**: Automatic memoization (no manual `useMemo` needed)
- **`useCallback`**: Event handlers optimized to prevent recreation
- **Minimal re-renders**: State updates batched efficiently

## Component-Specific Examples

### Button Component

```tsx
const rippleConfig: RippleConfig = {
  color: 'currentColor', // Adapts to button text color
  opacity: 0.1,
  disabled: disabled || loading,
};

const mergedConfig: Required<RippleConfig> = {
  ...RIPPLE_DEFAULTS,
  ...rippleConfig,
  disabled: disabled || loading,
};

// Use keyframeName='Button' to avoid conflicts
<RippleKeyframes name='Button' config={mergedConfig} />
```

### SelectMenu MenuItem

```tsx
const rippleConfig: RippleConfig = {
  color: 'rgb(24 28 32)', // on-surface color
  opacity: 0.1,
  disabled: option.disabled,
};

const mergedConfig: Required<RippleConfig> = {
  ...RIPPLE_DEFAULTS,
  ...rippleConfig,
  disabled: option.disabled || false,
};

// Use keyframeName='MenuItem' to avoid conflicts
<RippleKeyframes name='MenuItem' config={mergedConfig} />
```

## Important Notes

### Keyframe Names

Each component using ripples MUST use a unique `keyframeName` to prevent CSS keyframe conflicts. Use the component name:

```tsx
<RippleKeyframes name='Button' config={mergedConfig} />
<RippleKeyframes name='MenuItem' config={mergedConfig} />
<RippleKeyframes name='Chip' config={mergedConfig} />
```

### Required Styling

The parent element MUST have:

```tsx
className='relative overflow-hidden'
```

This ensures:

- `relative`: Ripple positions correctly relative to parent
- `overflow-hidden`: Ripple doesn't spill outside bounds

### Event Handlers

Always attach all handlers for proper ripple behavior:

```tsx
<button
  ref={rippleRef as any}
  onMouseDown={handleMouseDown}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}  // Important: Release ripple when mouse leaves
  onKeyDown={handleKeyDown}     // Keyboard support: Enter/Space keys
  onKeyUp={handleKeyUp}          // Keyboard support: Release ripple
  className='relative overflow-hidden'
>
```

### Keyboard Support

- `handleKeyDown`: Triggers ripple on Enter or Space key press
- `handleKeyUp`: Releases ripple when key is released
- **Centered Ripples**: Keyboard-triggered ripples originate from element center (width/2, height/2)
- **Repeat Protection**: Ignores key repeat events (e.repeat check) to prevent ripple spam
- **Key Filtering**: Only responds to Enter and Space keys, ignores all others

```tsx
onMouseDown={handleMouseDown}
onMouseUp={handleMouseUp}
onMouseLeave={handleMouseUp} // Important for proper cleanup
```

### Config Type

For components, use `Required<RippleConfig>` to ensure all properties are defined:

```tsx
const mergedConfig: Required<RippleConfig> = {
  ...RIPPLE_DEFAULTS,
  ...rippleConfig,
  disabled: disabled || false, // Ensure boolean, not undefined
};
```

## API Reference

### `useRipple(config?: RippleConfig): UseRippleReturn`

Returns:

```typescript
{
  ripples: RipplePosition[];
  rippleRef: React.RefObject<HTMLElement | null>;
  handleMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseUp: () => void;
  removeRipple: (id: number) => void;
}
```

### `<RippleEffect />`

Props:

```typescript
{
  x: number;              // Click X coordinate
  y: number;              // Click Y coordinate
  size: number;           // Ripple diameter
  isReleased: boolean;    // Whether mouse was released
  config: Required<RippleConfig>;
  keyframeName: string;   // Unique name for animations
  onComplete: () => void; // Cleanup callback
}
```

### `<RippleKeyframes />`

Props:

```typescript
{
  name: string;  // Unique component name
  config: Required<RippleConfig>;
}
```

### `calculateRippleSize()`

Calculates the ripple diameter to cover the entire element edge-to-edge using the Pythagorean theorem.

```typescript
calculateRippleSize(
  clickX: number,
  clickY: number,
  elementWidth: number,
  elementHeight: number
): number
```

## Behavior

### Smooth Touch-Responsive Animation

1. **mouseDown**: Ripple starts expanding from click point
2. **mouseUp/mouseLeave**: Ripple transitions to fade animation (550ms)
3. **Animation complete**: Ripple removed from DOM

### Hold Behavior

- Ripple continues expanding while held (up to 550ms)
- Fade animation starts from current scale when released
- Smooth transition regardless of release timing
- Animations complete naturally even when button becomes disabled/loading

### Multiple Ripples

Multiple overlapping ripples are supported and each animates independently.

### Disabled State Handling

When a button becomes disabled or enters a loading state:

- Active ripples continue and complete their animations naturally
- New ripples are prevented from triggering
- No abrupt animation interruption for better UX

## Maintenance

### Adding to New Components

1. Import utilities
2. Configure ripple with unique `keyframeName`
3. Use `useRipple` hook
4. Attach event handlers (mouseDown, mouseUp, mouseLeave)
5. Render `RippleEffect` components
6. Add `RippleKeyframes` with the same unique name

### Adjusting Defaults

Edit `RIPPLE_DEFAULTS` in `/app/lib/utils/ripple.tsx` to change project-wide defaults.

### Custom Colors

For theme colors, use Tailwind's `rgb()` format or CSS custom properties:

```tsx
color: 'rgb(24 28 32)'           // Direct RGB
color: 'currentColor'             // Inherits text color
color: 'var(--custom-color)'      // CSS variable
```

## Browser Compatibility

- Modern browsers with CSS3 animation support
- Hardware acceleration available on all major browsers
- Graceful degradation: interactive elements work without ripple if CSS animations unsupported
- Tested on: Chrome, Firefox, Safari, Edge

## Design Specifications

This implementation follows Material Design 3 interaction principles while being customized for SplitShifts:

- **Timing**: 550ms for both expand and fade animations (industry-standard responsive feel)
- **Easing**: Emphasized easing curve `cubic-bezier(0.0, 0.0, 0.2, 1)` for natural motion
- **Accessibility**: WCAG 2.1 AA compliant with proper interaction feedback
- **Performance**: GPU-accelerated to maintain 60fps on all supported devices

## Troubleshooting

### Ripples not visible

- Ensure parent has `relative` positioning
- Check `overflow-hidden` is applied to parent
- Verify `z-index` stacking context

### Performance issues

- Already optimized with GPU acceleration
- Check for excessive re-renders in parent component
- Ensure unique `keyframeName` per component type

### Animations cut short

- Confirm all three event handlers attached (mouseDown, mouseUp, mouseLeave)
- This is expected on fast navigation - prioritizes responsiveness over animation completion
