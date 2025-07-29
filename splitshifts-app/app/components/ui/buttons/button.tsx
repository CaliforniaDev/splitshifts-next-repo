'use client';
import Link from 'next/link';
import { ElementType, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import type { VariantProps } from 'class-variance-authority';
import { Loader } from 'lucide-react';
import { buttonVariants } from './variants';

/**
 * Props interface for the Button component
 * 
 * @template T - The element type to render (defaults to 'button')
 */
export interface ButtonProps<T extends ElementType = 'button'>
  extends VariantProps<typeof buttonVariants> {
  /** The element type to render or 'next-link' for Next.js Link components */
  as?: T | 'next-link';
  /** URL for link variants (required when using 'next-link') */
  href?: string;
  /** Button content */
  children: ReactNode;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Custom CSS classes */
  className?: string;
  /** Disables button interaction */
  disabled?: boolean;
  /** Shows loading spinner and disables button */
  loading?: boolean;
  /** Optional custom text to show when loading */
  loadingText?: string;
}

/**
 * Utility function to check if a given URL is an external link
 * 
 * @param href - The URL to check
 * @returns True if the URL starts with http:// or https://
 */
const isExternalLink = (href?: string): boolean => {
  return !!href && (href.startsWith('http://') || href.startsWith('https://'));
};

/**
 * Button component that supports multiple rendering modes and polymorphic behavior
 * 
 * A flexible button component that can render as different HTML elements,
 * Next.js Link components, or regular buttons with built-in loading states.
 * 
 * @example
 * ```tsx
 * // Regular button
 * <Button variant="filled">Click me</Button>
 * 
 * // Next.js Link  
 * <Button as="next-link" href="/dashboard">Go to Dashboard</Button>
 * 
 * // Loading state
 * <Button loading loadingText="Saving...">Save</Button>
 * 
 * // With icon
 * <Button icon={<PlusIcon />}>Add Item</Button>
 * ```
 */
export default function Button<T extends ElementType = 'button'>({
  as,
  href,
  variant = 'filled',
  size = 'default',
  children,
  icon,
  className,
  disabled = false,
  loading = false,
  loadingText,
  ...rest
}: ButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const isNextLink = as === 'next-link'; // Checks if we are using Next.js <Link>
  const isExternal = isExternalLink(href); // Determines if the link is external

  // Handle loading state - override icon and text when loading
  const displayIcon = loading 
    ? <Loader className='h-4 w-4 animate-spin' aria-hidden='true' />
    : icon;

  const displayChildren = loading && loadingText ? loadingText : children;
  
  // Button is disabled if explicitly disabled OR currently loading
  const isDisabled = disabled || loading;

  // Generate combined CSS classes with variant styles
  const mergedClass = twMerge(
    buttonVariants({
      variant,
      size,
      disabled: isDisabled,
      className,
    }),
    'text-center',
  );

  // Validation: Throw an error if someone tries to use `as="a"`
  if (as === 'a') {
    throw new Error('❌ <a> tags are not allowed. Use "next-link" instead.');
  }

  // Development warning: Alert if href is provided but `as="next-link"` is missing
  if (href && !isNextLink) {
    console.warn(
      `⚠️ Warning: href="${href}" provided but as="next-link" is missing.`,
    );
  }

  // Render as Next.js Link when as="next-link"
  if (isNextLink) {
    return (
      <Link
        href={href!}
        target={isExternal ? '_blank' : undefined} // Open external links in a new tab
        rel={isExternal ? 'noopener noreferrer' : undefined} // Security best practice for external links
        className={mergedClass}
        {...rest}
      >
        <span className='pointer-events-none relative flex items-center justify-center gap-2'>
          {displayIcon && (
            <span className='h-[18px] w-[18px] flex items-center justify-center flex-shrink-0'>{displayIcon}</span>
          )}
          {displayChildren}
        </span>
      </Link>
    );
  }

  // Default: Render as button or other valid HTML element
  const Component = as || 'button';

  return (
    <Component className={mergedClass} disabled={isDisabled} {...rest}>
      <span className='pointer-events-none relative flex items-center justify-center gap-2'>
        {displayIcon && (
          <span className='flex items-center justify-center flex-shrink-0'>{displayIcon}</span>
        )}
        {displayChildren}
      </span>
    </Component>
  );
}
