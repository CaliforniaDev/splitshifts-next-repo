import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

/**
 * Icon Button Component Variants
 *
 * Clean, maintainable CVA configuration for Material Design 3 buttons with:
 * - Consistent hover overlay system
 * - Proper disabled states
 * - Typography scaling
 */

// Active border radius values for each size (used for :active and keyboard press)
export const ACTIVE_BORDER_RADIUS = {
  xs: 'rounded-[8px]',
  small: 'rounded-[8px]',
  medium: 'rounded-[12px]',
  large: 'rounded-[16px]',
  xl: 'rounded-[16px]',
} as const;

// Icon size mapping for each button size
export const ICON_SIZE_CLASSES = {
  xs: 'h-5 w-5',      // 16px icon
  small: 'h-6 w-6',   // 24px icon
  medium: 'h-6 w-6',  // 24px icon
  large: 'h-8 w-8',   // 28px icon
  xl: 'h-10 w-10',    // 40px icon
} as const;

// Hit area wrapper - computed once at module level
const hitAreaBaseClasses = clsx([
  // Layout & Structure
  'relative inline-flex items-center justify-center group overflow-visible',
  // Accessibility - focus-visible shows outline only for keyboard navigation
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
]);

// Button surface classes - computed once at module level
const surfaceBaseClasses = clsx([
  // Layout & Structure
  'relative flex items-center justify-center overflow-hidden whitespace-nowrap',
  // Hover Overlay System
  'before:absolute before:inset-0 before:transition-all before:duration-200',
  // Border radius transition on press
  'rounded-full transition-[border-radius] duration-300 ease-out',
  // Performance - Force GPU layer for ripple animations
  '[transform-style:preserve-3d]',
]);

// State layer overlay system (hover/focus opacity handled per variant)
const stateLayer =
  'before:opacity-0 group-hover:before:opacity-8 group-focus-visible:before:opacity-10';

// Disabled state styling
const disabledState = 'text-on-surface/38 bg-on-surface/12 shadow-none';

export const hitAreaVariants = cva(hitAreaBaseClasses, {
  variants: {
    size: {
      xs: 'h-8 w-8 after:absolute after:inset-[-8px] after:rounded-full after:content-[""] after:bg-transparent after:pointer-events-auto', // 32px visual, 48px hit area
      small: 'h-10 w-10 after:absolute after:inset-[-4px] after:rounded-full after:content-[""] after:bg-transparent after:pointer-events-auto', // 40px visual, 48px hit area
      medium: 'h-12 w-12', // 48px
      large: 'h-14 w-14', // 56px
      xl: 'h-[136px] w-[136px]', // 136px
    },

    disabled: {
      true: 'pointer-events-none',
      false: null,
    },
  },

  defaultVariants: {
    size: 'small',
    disabled: false,
  },
});

export const buttonVariants = cva(surfaceBaseClasses, {
  variants: {
    variant: {
      elevated: `shadow-elevation-1 bg-surface-container-low text-primary before:bg-primary ${stateLayer}`,
      filled: `bg-primary text-on-primary before:bg-on-primary ${stateLayer}`,
      tonal: `bg-secondary-container text-on-secondary-container before:bg-on-secondary-container ${stateLayer}`,
      outlined: `border-2 border-outline-variant text-on-surface-variant before:bg-on-surface-variant ${stateLayer}`,
      standard: `text-on-surface-variant before:bg-on-surface-variant ${stateLayer}`,
      destructive: `bg-error text-on-error before:bg-on-error ${stateLayer}`,
    },

    size: {
      xs: 'w-8 h-8 rounded-[16px]', // 32px visual
      small: 'w-10 h-10 rounded-[20px]', // 40px visual
      medium: 'w-12 h-12 rounded-[24px]', // 48px
      large: 'w-14 h-14 rounded-[28px]', // 56px
      xl: 'w-[136px] h-[136px] rounded-[68px]', // 136px
    },

    disabled: {
      true: disabledState,
      false: null,
    },
  },

  compoundVariants: [
    {
      variant: 'elevated',
      disabled: true,
      class: 'shadow-none',
    },
  ],

  defaultVariants: {
    variant: 'filled',
    size: 'small',
    disabled: false,
  },
});
