'use client';

import React, { ElementType, ReactNode } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import type { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { buttonVariants, hitAreaVariants, ACTIVE_BORDER_RADIUS, ICON_SIZE_CLASSES } from './variants';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';

export interface IconButtonProps<T extends ElementType = 'button'>
  extends VariantProps<typeof buttonVariants> {
  as?: T | 'next-link';
  href?: string;
  icon: ReactNode; // Required - the icon to display
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const isExternalLink = (href?: string): boolean => {
  return !!href && (href.startsWith('http://') || href.startsWith('https://'));
};

/**
 * Icon-only button component with ripple effects
 * Supports regular buttons, Next.js links, and custom elements
 */
export default function IconButton<T extends ElementType = 'button'>({
  as,
  href,
  variant,
  size,
  icon,
  className,
  disabled = false,
  loading = false,
  onClick: userOnClick,
  onKeyDown: userOnKeyDown,
  onKeyUp: userOnKeyUp,
  ...rest
}: IconButtonProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof IconButtonProps<T>>) {
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

  const { ripples, rippleRef, handleMouseDown, handleMouseUp, handleKeyDown, handleKeyUp, removeRipple } =
    useRipple(rippleConfig);

  // Track keyboard press state for active styling
  const [isKeyPressed, setIsKeyPressed] = React.useState(false);
  // Track mouse press state for active styling
  const [isMousePressed, setIsMousePressed] = React.useState(false);

  // Merge user's onMouseDown with ripple's handleMouseDown
  const mergedMouseDownHandler = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setIsMousePressed(true);
      handleMouseDown(e);
    },
    [handleMouseDown],
  );

  // Merge user's onMouseUp with ripple's handleMouseUp
  const mergedMouseUpHandler = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      setIsMousePressed(false);
      handleMouseUp();
    },
    [handleMouseUp],
  );

  // Merge user's onKeyDown with ripple's handleKeyDown
  // Also prevent default to stop button from triggering on keydown
  const mergedKeyDownHandler = React.useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent default button click on keydown
        if (!e.repeat) {
          setIsKeyPressed(true); // Trigger active state
        }
      }
      handleKeyDown(e);
      userOnKeyDown?.(e as any);
    },
    [handleKeyDown, userOnKeyDown],
  );

  // Merge user's onKeyUp with ripple's handleKeyUp
  // Trigger onClick on keyup to match mouse behavior
  const mergedKeyUpHandler = React.useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      handleKeyUp(e);
      // Trigger click on keyup (after ripple is released)
      if (e.key === 'Enter' || e.key === ' ') {
        setIsKeyPressed(false); // Release active state
        userOnClick?.(e as any);
      }
      userOnKeyUp?.(e as any);
    },
    [handleKeyUp, userOnClick, userOnKeyUp],
  );

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

  const isDisabled = disabled || loading;
  const resolvedSize = size ?? 'small';

  // Apply icon size based on button size
  const sizedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon, {
        className: twMerge(
          ICON_SIZE_CLASSES[resolvedSize], 
          (icon.props as any)?.className
        ),
      } as any)
    : icon;

  const displayIcon = loading ? (
    <Loader2 className={twMerge(ICON_SIZE_CLASSES[resolvedSize], 'animate-spin')} aria-hidden='true' />
  ) : (
    sizedIcon
  );

  const hitAreaClass = twMerge(
    hitAreaVariants({
      size: resolvedSize,
      disabled: isDisabled,
      className,
    }),
  );

  const surfaceClass = twMerge(
    buttonVariants({
      variant,
      size: resolvedSize,
      disabled: isDisabled,
    }),
    // Apply active border radius when key or mouse is pressed
    (isKeyPressed || isMousePressed)
      ? ACTIVE_BORDER_RADIUS[resolvedSize]
      : '',
  );

  const surfaceContent = (
    <span ref={setRippleRef} className={surfaceClass}>
      <span className='pointer-events-none relative z-10'>
        {displayIcon}
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
    </span>
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
        <span className={hitAreaClass} role='link' aria-disabled='true' {...rest}>
          {surfaceContent}
        </span>
      );
    }

    // Disabled link renders as span
    if (isDisabled) {
      return (
        <span className={hitAreaClass} role='link' aria-disabled='true' {...rest}>
          {surfaceContent}
        </span>
      );
    }

    return (
      <Link
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={hitAreaClass}
        onClick={userOnClick as any}
        onMouseDown={mergedMouseDownHandler}
        onMouseUp={mergedMouseUpHandler}
        onMouseLeave={mergedMouseUpHandler}
        onKeyDown={mergedKeyDownHandler}
        onKeyUp={mergedKeyUpHandler}
        aria-busy={loading}
        {...rest}
      >
        {surfaceContent}
      </Link>
    );
  }

  // Render as button or custom element
  const Component = as || 'button';

  return (
    <Component
      className={hitAreaClass}
      disabled={isDisabled}
      onClick={userOnClick as any}
      onMouseDown={mergedMouseDownHandler}
      onMouseUp={mergedMouseUpHandler}
      onMouseLeave={mergedMouseUpHandler}
      onKeyDown={mergedKeyDownHandler}
      onKeyUp={mergedKeyUpHandler}
      aria-busy={loading}
      aria-disabled={isDisabled}
      aria-live={loading ? 'polite' : undefined}
      {...rest}
    >
      {surfaceContent}
    </Component>
  );
}
