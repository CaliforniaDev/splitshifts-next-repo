'use client';
import clsx from 'clsx';
import {
  baseStyle,
  styles,
  stateLayer,
  sizeStyles,
  disabledStyle,
  StyleVariants,
  SizeVariants,
} from './styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: StyleVariants;
  size?: SizeVariants;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * The `Button` component is a reusable styled button that supports multiple variants
 * and sizes. It provides flexibility with different styles, including elevated, filled,
 * tonal, outlined, and text buttons, along with size options.
 *
 * Props:
 * - `variant` (optional, StyleVariants): The style variant of the button. Available values:
 *     - `'elevated'`: Adds shadow and background.
 *     - `'filled'`: Solid color background.
 *     - `'tonal'`: Background with a more subtle tone.
 *     - `'outlined'`: No background, only a border.
 *     - `'text'`: No background or border, just text.
 *   Default: `'filled'`.
 * - `size` (optional, SizeVariants): The size variant of the button. Available values:
 *     - `'default'`: Normal size.
 *     - `'large'`: Larger size with more padding.
 *   Default: `'default'`.
 * - `children` (ReactNode): The content to display inside the button, usually text.
 * - `className` (optional, string): Additional custom classes to apply to the button.
 *   This can be used to extend or override the default styles.
 * - `disabled` (optional, boolean): If true, the button will be disabled and non-interactive.
 *   Adds appropriate styling for disabled state.
 * - `rest` (any): Additional props to pass to the underlying `<button>` element, such as event handlers
 *   like `onClick`.
 *
 * @param {ButtonProps} props The props for the Button component.
 * @returns The rendered Button component with the provided styling and content.
 */

export default function Button({
  variant = 'filled',
  size = 'default',
  children = 'Button',
  className = '',
  disabled = false,
  ...rest
}: ButtonProps) {
  className = clsx(
    className,
    baseStyle,
    styles[variant],
    stateLayer[variant],
    sizeStyles[size],
    disabled ? disabledStyle[variant] : '',
  );

  return (
    <button className={className} disabled={disabled} {...rest}>
      <span className='pointer-events-none relative'>{children}</span>
    </button>
  );
}
