'use client';
/**
 * Button component
 *
 * This component renders a button with different styles based on the `variant` prop.
 *
 * Props:
 * - `variant` (string): The style variant of the button. Can be 'outlined' or 'text'.
 * - `disabled` (boolean): If true, the button will be disabled.
 * - `onClick` (function): The function to call when the button is clicked.
 * - `children` (ReactNode): The content to display inside the button.
 * - `className` (string): Additional classes to apply to the button.
 */

type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';
type ButtonSize = 'default' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  variant = 'filled',
  size = 'default',
  children = 'Button',
  className = '',
  disabled = false,
  ...rest
}: ButtonProps) {
  // Base Button Styles Used for All Variants
  const baseStyle =
    'relative overflow-hidden whitespace-nowrap rounded-[10px] before:absolute before:inset-0 before:transition-all before:duration-200 focus:outline-none';

  // Variant Styles
  const styles = {
    elevated: 'shadow-elevation-1 bg-surface-container-low text-primary',
    filled: 'bg-primary text-on-primary',
    tonal: 'bg-secondary-container text-on-secondary-container',
    outlined: 'border border-outline text-primary',
    text: 'text-primary',
  };

  // State Overlay Layer Styles Used for Hover and Focus States
  const stateLayer = {
    elevated: 'before:bg-primary before:opacity-0 hover:before:opacity-8',
    filled: 'before:bg-on-primary before:opacity-0 hover:before:opacity-8',
    tonal: 'before:bg-on-secondary-container before:opacity-0  hover:before:hover:opacity-8', // prettier-ignore
    outlined: 'before:bg-primary before:opacity-0 hover:before:opacity-8',
    text: 'before:bg-primary before:opacity-0 hover:before:opacity-8',
  };

  // Button Size Styles
  const sizeStyles = {
    default: 'typescale-label-large px-6 py-2.5',
    large: 'typescale-title-large-prominent font px-8 py-2 ',
  };

  // Disabled Button Styles
  const disabledStyle = disabled ? 'opacity-disabled cursor-not-allowed' : '';

  return (
    <button
      className={`${className} ${baseStyle} ${styles[variant]} ${stateLayer[variant]} ${sizeStyles[size]} ${disabledStyle}`}
      disabled={disabled}
      {...rest}
    >
      <span className='pointer-events-none relative'>{children}</span>
    </button>
  );
}

// type ButtonProps = {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   children: React.ReactNode;
//   disabled?: boolean;
//   className?: string;
// } & React.ButtonHTMLAttributes<HTMLButtonElement>;
