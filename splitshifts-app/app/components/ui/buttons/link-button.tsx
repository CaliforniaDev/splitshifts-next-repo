import Link from 'next/link';
import clsx from 'clsx';

import {
  baseStyle,
  styles,
  stateLayer,
  sizeStyles,
  StyleVariants,
  SizeVariants,
} from './styles';

interface LinkButtonProps {
  href: string;
  variant?: StyleVariants;
  size?: SizeVariants;
  children: React.ReactNode;
  className?: string;
}

/**
 * The `LinkButton` component is intended for use cases where
 * you need a link that visually looks like a button. It provides
 * consistent styling with the `Button` component but functions
 * as a navigation link instead of a button.
 *
 * Props:
 * - `href` (string, required): The URL to link to. Must be a valid URL string.
 * - `variant` (optional, StyleVariants): The style variant of the button. Available values:
 *     - `'elevated'`: Adds shadow and background.
 *     - `'filled'`: Solid color background.
 *     - `'tonal'`: Background with a more subtle tone.
 *     - `'outlined'`: No background, only a border.
 *     - `'text'`: No background or border, just text.
 *   Default: `'filled'`.
 * - `size` (optional, SizeVariants): The size of the button. Available values:
 *     - `'default'`: Normal size.
 *     - `'large'`: Larger size with more padding.
 *   Default: `'default'`.
 * - `children` (ReactNode): The content to display inside the button, usually text.
 * - `className` (optional, string): Additional custom classes to apply to the button.
 * - `rest` (any): Additional props to pass to the `Link` component.
 *
 * @param {LinkButtonProps} props The props for the LinkButton component.
 * @returns The rendered LinkButton component.
 *
 */

export default function LinkButton({
  href,
  variant = 'filled',
  size = 'default',
  children = 'Link',
  className = '',
  ...rest
}: LinkButtonProps) {
  /**
   * The `className` variable is used to apply the appropriate styles to the button based on the props.
   * The `clsx` function is used to concatenate the class names together.
   */
  className = clsx(
    className,
    baseStyle,
    styles[variant],
    stateLayer[variant],
    sizeStyles[size],
  );
  return (
    <Link className={className} href={href} {...rest}>
      <span className='pointer-events-none relative'>{children}</span>
    </Link>
  );
}
