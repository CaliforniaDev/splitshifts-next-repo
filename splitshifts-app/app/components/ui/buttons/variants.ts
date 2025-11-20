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
  'relative overflow-hidden whitespace-nowrap',
  // Hover Overlay System
  'before:absolute before:inset-0 before:transition-all before:duration-200',
  // Border radius transition on press
  'transition-[border-radius] duration-300 ease-out',
  // Accessibility
  'focus:outline-none',
  // Performance - Force GPU layer for ripple animations
  '[transform-style:preserve-3d]',
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
      xs: 'typescale-label-large px-3 h-8 flex items-center justify-center rounded-[16px] active:rounded-[8px]',
      small: 'typescale-label-large px-4 h-10 flex items-center justify-center rounded-[20px] active:rounded-[8px]',
      medium: 'typescale-title-medium px-6 h-14 flex items-center justify-center rounded-[28px] active:rounded-[12px]',
      large: 'typescale-headline-small px-12 h-24 flex items-center justify-center rounded-[48px] active:rounded-[16px]',
      xl: 'typescale-headline-large px-16 h-[136px] flex items-center justify-center rounded-[68px] active:rounded-[16px]'
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
