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

// Base class definitions - computed once at module level
const baseClasses = clsx([
  // Layout & Structure
  'relative overflow-hidden whitespace-nowrap rounded-[10px]',
  // Hover Overlay System
  'before:absolute before:inset-0 before:transition-all before:duration-200',
  // Accessibility
  'focus:outline-none',
]);

// Common hover overlay (8% opacity on all variants)
const hoverOverlay = 'before:opacity-0 hover:before:opacity-8';

// Disabled state styling
const disabledState = 'text-on-surface/38 bg-on-surface/12 shadow-none pointer-events-none';

export const buttonVariants = cva(baseClasses, {
  variants: {
    variant: {
      elevated: `shadow-elevation-1 bg-surface-container-low text-primary before:bg-primary ${hoverOverlay}`,
      filled: `bg-primary text-on-primary before:bg-on-primary ${hoverOverlay}`,
      tonal: `bg-secondary-container text-on-secondary-container before:bg-on-secondary-container ${hoverOverlay}`,
      outlined: `border border-outline text-primary before:bg-primary ${hoverOverlay}`,
      text: `text-primary before:bg-primary ${hoverOverlay}`,
      destructive: `bg-error text-on-error before:bg-on-primary ${hoverOverlay}`
    },
    
    size: {
      default: 'typescale-label-large px-6 py-2.5',
      large: 'typescale-title-large-prominent font px-8 py-2'
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
    size: 'default',
    disabled: false
  }
});
