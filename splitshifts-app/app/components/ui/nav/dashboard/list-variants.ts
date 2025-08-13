import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

/**
 * Navigation List Item Link Variants
 *
 * Clean, maintainable CVA configuration with:
 * - Multi-layer animation system (::before, content, ::after)
 * - Material Design 3 compliant interactions
 * - Extreme visual feedback effects
 */

// Shared class fragments for maintainability
const baseClasses = clsx([
  // Layout & Structure
  'relative flex overflow-hidden h-14 w-full items-center gap-3 rounded-full px-3 py-2',

  // Typography - Using label-large typescale per Material Design 3 Navigation Rail (expanded) spec
  'typescale-label-large',

  // Base Transitions
  'transition-all duration-200',

  // Accessibility
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-outline focus-visible:outline-offset-2',

  // SVG Animation Setup
  '[&_svg]:transition-all [&_svg]:duration-200 [&_svg]:ease-[cubic-bezier(0.2,0,0,1)]',

  // Z-index Layering
  '[&>*]:relative [&>*]:z-10',
]);

const overlayBase = clsx([
  'after:absolute after:inset-0 after:rounded-full',
  'after:transition-opacity after:duration-150 after:ease-[cubic-bezier(0.2,0,0,1)]',
  'after:z-20',
]);

const backgroundAnimation = clsx([
  'before:absolute before:inset-0 before:rounded-full',
  'before:bg-secondary-container before:scale-x-0',
  'before:animate-expand-from-center before:origin-center',
]);

const iconEffects = clsx([
  // Hover: thicker + bigger
  '[&_svg]:hover:stroke-[6.5] [&_svg]:hover:scale-105',
  // Focus: same as hover
  '[&_svg]:focus-visible:stroke-[6.5]',
  // Press: thinner + smaller
  '[&_svg]:active:stroke-[0.3] [&_svg]:active:scale-95',
]);

const textEffects = clsx([
  'hover:typescale-label-large-prominent focus-visible:typescale-label-large-prominent active:typescale-label-large',
]);

export const listItemLinkVariants = cva(baseClasses, {
  variants: {
    active: {
      true: `text-on-secondary-container typescale-label-large-prominent ${backgroundAnimation}`,
      false: 'text-on-surface-variant',
    },

    overlay: {
      default: `${overlayBase} after:opacity-0 hover:after:opacity-100 focus-visible:after:opacity-100 active:after:opacity-100`,
      active: `${overlayBase} after:opacity-100`,
    },
  },

  compoundVariants: [
    {
      active: false,
      overlay: 'default',
      class: clsx(`
        hover:after:bg-on-surface/8 focus-visible:after:bg-on-surface/10 active:after:bg-on-surface/10
        hover:text-on-surface focus-visible:text-on-surface
        ${textEffects} ${iconEffects}
      `),
    },
    {
      active: true,
      overlay: 'active',
      class: clsx(`
        hover:after:bg-on-secondary-container/8 focus-visible:after:bg-on-secondary-container/10 active:after:bg-on-secondary-container/10
        ${textEffects} ${iconEffects}
      `),
    },
  ],

  defaultVariants: {
    active: false,
    overlay: 'default',
  },
});
