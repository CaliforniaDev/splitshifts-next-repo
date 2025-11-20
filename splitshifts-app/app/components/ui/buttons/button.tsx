'use client';

import React, { ElementType, ReactNode } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { buttonVariants } from './variants';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';

export interface ButtonProps<T extends ElementType = 'button'>
  extends VariantProps<typeof buttonVariants> {
  as?: T | 'next-link';
  href?: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const isExternalLink = (href?: string): boolean => {
  return !!href && (href.startsWith('http://') || href.startsWith('https://'));
};

/**
 * Polymorphic button component with ripple effects and loading states
 * Supports regular buttons, Next.js links, and custom elements
 */
export default function Button<T extends ElementType = 'button'>({
  as,
  href,
  variant,
  size,
  children,
  icon,
  className,
  disabled = false,
  loading = false,
  loadingText,
  ...rest
}: ButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {
  const rippleConfig: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: disabled || loading,
  };

  const mergedConfig: Required<RippleConfig> = {
    ...RIPPLE_DEFAULTS,
    ...rippleConfig,
    disabled: disabled || loading,
  };

  const { ripples, rippleRef, handleMouseDown, handleMouseUp, removeRipple } =
    useRipple(rippleConfig);

  const isNextLink = as === 'next-link';
  const isExternal = isExternalLink(href);

  // Callback ref for polymorphic component support
  const setRippleRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (rippleRef && typeof rippleRef === 'object' && 'current' in rippleRef) {
        rippleRef.current = node;
      }
    },
    [rippleRef],
  );

  const displayIcon = loading ? (
    <Loader2 className='h-4 w-4 animate-spin' aria-hidden='true' />
  ) : (
    icon
  );

  const displayChildren = loading && loadingText ? loadingText : children;
  const isDisabled = disabled || loading;

  const mergedClass = twMerge(
    buttonVariants({
      variant,
      size,
      disabled: isDisabled,
      className,
    }),
    'text-center',
  );

  // Development-only validations
  if (process.env.NODE_ENV === 'development') {
    if (as === 'a') {
      throw new Error('Use "next-link" instead of <a> tags');
    }
    if (href && !isNextLink) {
      console.warn(`href provided but as="next-link" missing: ${href}`);
    }
    if (isNextLink && !href) {
      console.error('as="next-link" requires href prop');
    }
  }

  // Render as Next.js Link
  if (isNextLink) {
    if (!href) {
      return (
        <span className={mergedClass} role='link' aria-disabled='true'>
          <span className='pointer-events-none relative z-10 flex items-center justify-center gap-2'>
            {displayIcon && (
              <span className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center'>
                {displayIcon}
              </span>
            )}
            {displayChildren}
          </span>
        </span>
      );
    }

    // Disabled link renders as span
    if (isDisabled) {
      return (
        <span className={mergedClass} role='link' aria-disabled='true'>
          <span className='pointer-events-none relative z-10 flex items-center justify-center gap-2'>
            {displayIcon && (
              <span className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center'>
                {displayIcon}
              </span>
            )}
            {displayChildren}
          </span>
        </span>
      );
    }

    return (
      <Link
        ref={setRippleRef}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={mergedClass}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        aria-busy={loading}
        {...rest}
      >
        <span className='pointer-events-none relative z-10 flex items-center justify-center gap-2'>
          {displayIcon && (
            <span className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center'>
              {displayIcon}
            </span>
          )}
          {displayChildren}
        </span>

        {ripples.map(ripple => (
          <RippleEffect
            key={ripple.id}
            {...ripple}
            config={mergedConfig}
            keyframeName='Button'
            onComplete={() => removeRipple(ripple.id)}
          />
        ))}

        <RippleKeyframes name='Button' config={mergedConfig} />
      </Link>
    );
  }

  // Render as button or custom element
  const Component = as || 'button';

  return (
    <Component
      ref={setRippleRef}
      className={mergedClass}
      disabled={isDisabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      aria-busy={loading}
      aria-disabled={isDisabled}
      aria-live={loading ? 'polite' : undefined}
      {...rest}
    >
      <span className='pointer-events-none relative z-10 flex items-center justify-center gap-2'>
        {displayIcon && (
          <span className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center'>
            {displayIcon}
          </span>
        )}
        {displayChildren}
      </span>

      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          {...ripple}
          config={mergedConfig}
          keyframeName='Button'
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}

      <RippleKeyframes name='Button' config={mergedConfig} />
    </Component>
  );
}
