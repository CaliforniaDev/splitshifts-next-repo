import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'relative overflow-hidden whitespace-nowrap rounded-[10px] before:absolute before:inset-0 before:transition-all before:duration-200 focus:outline-none',
  {
    variants: {
      variant: {
        elevated:
          'shadow-elevation-1 bg-surface-container-low text-primary before:bg-primary before:opacity-0 hover:before:opacity-8',
        filled:
          'bg-primary text-on-primary before:bg-on-primary before:opacity-0 hover:before:opacity-8',
        tonal:
          'bg-secondary-container text-on-secondary-container before:bg-on-secondary-container before:opacity-0  hover:before:opacity-8',
        outlined:
          'border border-outline text-primary before:bg-primary before:opacity-0 hover:before:opacity-8',
        text: 'text-primary before:bg-primary before:opacity-0 hover:before:opacity-8',
        destructive:
          'bg-error text-on-error before:bg-on-primary before:opacity-0 hover:before:opacity-8',
      },
      size: {
        default: 'typescale-label-large px-6 py-2.5',
        large: 'typescale-title-large-prominent font px-8 py-2 ',
      },
      disabled: {
        true: 'text-on-surface/38 bg-on-surface/12 shadow-none pointer-events-none',
        false: null,
      },
    },
    compoundVariants: [
      {
        variant: 'elevated',
        disabled: true,
        class: 'shadow-none pointer-events-none',
      },
    ],
    defaultVariants: {
      variant: 'filled',
      size: 'default',
      disabled: false,
    },
  },
);
