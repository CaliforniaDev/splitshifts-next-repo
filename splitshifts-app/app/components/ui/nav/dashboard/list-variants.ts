import { cva } from 'class-variance-authority';

/**
 * Navigation List Item Link Variants
 *
 * A comprehensive CVA configuration for dashboard navigation links with:
 * - Active/inactive states with different background colors
 * - Hover overlays (8% opacity)
 * - Focus overlays (10% opacity)
 * - Material Design 3 compliant styling
 * - Proper accessibility with focus-visible outlines
 */
export const listItemLinkVariants = cva(
  // Base styles applied to all navigation links
  'relative flex overflow-hidden h-14 w-full items-center gap-3 rounded-full px-3 py-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-outline focus-visible:outline-offset-2 ',
  {
    variants: {
      // Active state - determines if navigation item is currently selected
      active: {
        true: 'bg-secondary-container text-on-secondary-container', // Active: filled background
        false: 'text-on-surface-variant', // Inactive: no background, muted text
      },

      // Overlay system - controls ::before pseudo-element for hover/focus effects
      overlay: {
        // Default overlay for inactive items - hidden by default, shows on interaction
        default:
          'before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-200 before:opacity-0 hover:before:opacity-100 focus-visible:before:opacity-100',

        // Active overlay for selected items - always visible for consistent styling
        active:
          'before:absolute before:inset-0 before:rounded-full before:transition-opacity before:duration-200 before:opacity-100',
      },
    },

    // Compound variants - combine active state + overlay type for specific styling
    compoundVariants: [
      {
        // Inactive items: show on-surface overlay on hover/focus
        active: false,
        overlay: 'default',
        class:
          'hover:before:bg-on-surface/8 focus-visible:before:bg-on-surface/10',
      },
      {
        // Active items: show on-secondary-container overlay on hover/focus
        active: true,
        overlay: 'active',
        class:
          'hover:before:bg-on-secondary-container/8 focus-visible:before:bg-on-secondary-container/10',
      },
    ],

    // Default values when no props are passed
    defaultVariants: {
      active: false,
      overlay: 'default',
    },
  },
);
