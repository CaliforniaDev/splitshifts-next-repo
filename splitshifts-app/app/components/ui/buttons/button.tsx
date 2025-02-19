'use client';
import { ElementType, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  baseStyle,
  styles,
  stateLayer,
  sizeStyles,
  disabledStyle,
  StyleVariants,
  SizeVariants,
} from './styles';

interface ButtonProps<T extends ElementType = 'button'> {
  as?: T;
  variant?: StyleVariants;
  size?: SizeVariants;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * The `Button` component is a reusable styled button that supports multiple variants,
 * sizes, and dynamic HTML elements via the `as` prop.
 *
 * ## Props:
 * - **`as` (optional, `ElementType`)**: Defines the HTML element for the button.  
 *   Defaults to `<button>`, but can be `'a'`, `'div'`, etc.
 * - **`variant` (optional, `StyleVariants`)**: Determines the button style. Options:
 *     - `'elevated'`: Adds shadow and background.
 *     - `'filled'`: Solid color background (default).
 *     - `'tonal'`: Background with a more subtle tone.
 *     - `'outlined'`: No background, only a border.
 *     - `'text'`: No background or border, just text.
 * - **`size` (optional, `SizeVariants`)**: Adjusts button size. Options:
 *     - `'default'`: Normal size (default).
 *     - `'large'`: Larger padding and height.
 * - **`children` (ReactNode)**: The button’s content.
 * - **`className` (optional, `string`)**: Additional classes for styling.
 * - **`disabled` (optional, `boolean`)**: If true, disables the button.
 * - **`...rest`**: Additional props, including valid attributes for `T` (e.g., `href` if `as="a"`).
 *
 * @template T - The HTML element type, inferred from `as`. Defaults to `"button"`.
 * @param {ButtonProps<T>} props - The props for the Button component.
 * @returns {JSX.Element} The rendered Button component.
 */


export default function Button<T extends ElementType = 'button'>({
  as,
  variant = 'filled',
  size = 'default',
  children,
  className,
  disabled = false,
  ...rest
}: ButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const Component = as || 'button'; // Defaults to <button> if `as` is not provided.

  const mergedClass = twMerge(
    clsx(
      baseStyle,
      styles[variant],
      stateLayer[variant],
      sizeStyles[size],
      disabled && disabledStyle[variant],
      className,
    ),
  );

  return (
    <Component className={mergedClass} disabled={disabled} {...rest}>
      <span className='pointer-events-none relative'>{children}</span>
    </Component>
  );
}
