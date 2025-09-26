import { cva } from 'class-variance-authority';

export const STEP_DISPLAY_CONFIG = [
  {
    key: 'organization',
    title: 'Organization',
    description: 'Create your organization',
  },
  {
    key: 'worksite',
    title: 'Worksite',
    description: 'Add your first worksite',
  },
  { key: 'roles', title: 'Roles', description: 'Create job roles' },
  { key: 'employees', title: 'Employees', description: 'Add employees' },
] as const;

export const stepIndicatorVariants = cva(
  'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500',
  {
    variants: {
      active: {
        true: 'bg-secondary-container text-on-secondary-container scale-110',
        false: 'bg-on-surface/16 text-on-surface-variant opacity-30 scale-100',
      },
    },
    defaultVariants: { active: false },
  },
);

export const stepTextVariants = cva('typescale-label-large', {
  variants: {
    active: {
      true: 'text-on-surface typescale-body-medium-prominent',
      false: 'text-on-surface-variant opacity-70',
    },
  },
  defaultVariants: { active: false },
});
