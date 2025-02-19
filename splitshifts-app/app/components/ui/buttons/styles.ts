// These styles are shared between the `button` and `link-button` components
// to ensure consistent styling. Each component can use `variant` and `size`
// props to apply appropriate styles.

export type StyleVariants = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text'; // prettier-ignore
export type SizeVariants = 'default' | 'large';

// Base Button Styles Used for All Variants
export const baseStyle =
  'relative overflow-hidden whitespace-nowrap rounded-[10px] before:absolute before:inset-0 before:transition-all before:duration-200 focus:outline-none';

// Variant Styles
export const styles = {
  elevated: 'shadow-elevation-1 bg-surface-container-low text-primary',
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'border border-outline text-primary',
  text: 'text-primary',
};

// State Layer (hover effects)
export const stateLayer = {
  elevated: 'before:bg-primary before:opacity-0 hover:before:opacity-8',
  filled: 'before:bg-on-primary before:opacity-0 hover:before:opacity-8',
  tonal: 'before:bg-on-secondary-container before:opacity-0  hover:before:opacity-8', // prettier-ignore
  outlined: 'before:bg-primary before:opacity-0 hover:before:opacity-8',
  text: 'before:bg-primary before:opacity-0 hover:before:opacity-8',
};

// Size Variants
export const sizeStyles = {
  default: 'typescale-label-large px-6 py-2.5',
  large: 'typescale-title-large-prominent font px-8 py-2 ',
};

// Disabled Button Styles
export const disabledStyle = {
  elevated:
    'text-on-surface/38 bg-on-surface/12 shadow-none pointer-events-none',
  filled: 'text-on-surface/38 bg-on-surface/12 pointer-events-none',
  tonal: 'text-on-surface/38 bg-on-surface/12 pointer-events-none',
  outlined: 'text-on-surface/38 pointer-events-none',
  text: 'text-on-surface/38 pointer-events-none',
};
