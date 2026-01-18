import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

/**
 * Button Component Variants
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

// Base class definitions - computed once at module level
const baseClasses = clsx([
  // Layout & Structure
  'relative overflow-hidden whitespace-nowrap',
  // Hover Overlay System
  'before:absolute before:inset-0 before:transition-all before:duration-200',
  // Border radius transition on press
  'transition-[border-radius] duration-300 ease-out',
  // Accessibility - focus-visible shows outline only for keyboard navigation
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
  // Performance - Force GPU layer for ripple animations
  '[transform-style:preserve-3d]',
]);

// State layer overlay system (hover/focus opacity handled per variant)
const stateLayer = 'before:opacity-0 hover:before:opacity-8 focus:before:opacity-10';

// Disabled state styling
const disabledState = 'text-on-surface/38 bg-on-surface/12 shadow-none pointer-events-none';

export const buttonVariants = cva(baseClasses, {
  variants: {
    variant: {
      elevated: `shadow-elevation-1 bg-surface-container-low text-primary before:bg-primary ${stateLayer}`,
      filled: `bg-primary text-on-primary before:bg-on-primary ${stateLayer}`,
      tonal: `bg-secondary-container text-on-secondary-container before:bg-on-secondary-container ${stateLayer}`,
      outlined: `border border-outline text-primary before:bg-primary ${stateLayer}`,
      text: `text-primary before:bg-primary ${stateLayer}`,
      destructive: `bg-error text-on-error before:bg-on-primary ${stateLayer}`
    },
    
    size: {
      xs: `typescale-label-large px-3 h-8 flex items-center justify-center rounded-[16px] active:${ACTIVE_BORDER_RADIUS.xs}`,
      small: `typescale-label-large px-4 h-10 flex items-center justify-center rounded-[20px] active:${ACTIVE_BORDER_RADIUS.small}`,
      medium: `typescale-title-medium px-6 h-14 flex items-center justify-center rounded-[28px] active:${ACTIVE_BORDER_RADIUS.medium}`,
      large: `typescale-headline-small px-12 h-24 flex items-center justify-center rounded-[48px] active:${ACTIVE_BORDER_RADIUS.large}`,
      xl: `typescale-headline-large px-16 h-[136px] flex items-center justify-center rounded-[68px] active:${ACTIVE_BORDER_RADIUS.xl}`
    },
    
    disabled: {
      true: disabledState,
      false: null
    }
  },

  compoundVariants: [
    {
      variant: 'elevated',
      disabled: true,
      class: 'shadow-none pointer-events-none'
    }
  ],

  defaultVariants: {
    variant: 'filled',
    size: 'small',
    disabled: false
  }
});
