'use client';
import Link from 'next/link';
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

// Define the types for the component props
interface ButtonProps<T extends ElementType = 'button'> {
  as?: T | 'next-link'; // Allows "next-link" but not "a"
  href?: string; // Required when using a link
  variant?: StyleVariants; // Controls button style
  size?: SizeVariants; // Controls button size
  children: ReactNode; // Button content
  className?: string; // Custom styles
  disabled?: boolean; // Disables button interaction
}

/**
 * Utility function to check if a given `href` is an external link.
 * External links start with "http://" or "https://".
 */
const isExternalLink = (href?: string): boolean => {
  return !!href && (href.startsWith('http://') || href.startsWith('https://'));
};

export default function Button<T extends ElementType = 'button'>({
  as,
  href,
  variant = 'filled',
  size = 'default',
  children,
  className,
  disabled = false,
  ...rest
}: ButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const isNextLink = as === 'next-link'; // Checks if we are using Next.js <Link>
  const isExternal = isExternalLink(href); // Determines if the link is external

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

  // Throw an error if someone tries to use `as="a"`
  if (as === 'a') {
    throw new Error('❌ <a> tags are not allowed. Use "next-link" instead.');
  }

  // Warn if href is provided but `as="next-link"` is missing
  if (href && !isNextLink) {
    console.warn(
      `⚠️ Warning: href="${href}" provided but as="next-link" is missing.`,
    );
  }

  // If `as="next-link"`, render a Next.js <Link>
  if (isNextLink) {
    return (
      <Link
        href={href!}
        target={isExternal ? '_blank' : undefined} // Open external links in a new tab
        rel={isExternal ? 'noopener noreferrer' : undefined} // Security best practice for external links
        className={mergedClass}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  // Default to a button or other valid HTML element
  const Component = as || 'button';

  return (
    <Component className={mergedClass} disabled={disabled} {...rest}>
      {/* Wraps content to prevent pointer events on child elements */}
      <span className='pointer-events-none relative'>{children}</span>
    </Component>
  );
}
