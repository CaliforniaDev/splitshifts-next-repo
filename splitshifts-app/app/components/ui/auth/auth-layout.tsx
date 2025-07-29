'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import Logo from '@/app/components/ui/logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  /**
   * The image to display on the left side of the auth layout
   * Defaults to the dashboard mockup
   */
  imageSrc?: string;
  /**
   * Alt text for the image
   */
  imageAlt?: string;
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Whether to reverse the layout (form on left, image on right)
   * Defaults to false (image on left, form on right)
   */
  reverse?: boolean;
  /**
   * Whether to show the overlay on the image for better text contrast
   * Defaults to true
   */
  showOverlay?: boolean;
  /**
   * Whether to show the logo at the top of the form
   * Defaults to true
   */
  showLogo?: boolean;
  /**
   * URL to navigate to when logo is clicked
   * Defaults to home page '/'
   */
  logoHref?: string;
}

/**
 * AuthLayout Component
 *
 * A responsive layout component for authentication pages that displays:
 * - A full-height image on the left side (hidden on mobile)
 * - Form content on the right side (full width on mobile)
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Customizable image and layout direction
 * - Follows the existing design system
 * - Optimized for all auth form types
 */
export default function AuthLayout({
  children,
  imageSrc = '/assets/auth/login-side-image.webp',
  imageAlt = 'Abstract image',
  className,
  reverse = false,
  showOverlay = true,
  showLogo = true,
  logoHref = '/',
}: AuthLayoutProps) {
  return (
    <div
      className={cn('min-h-screen w-full lg:grid lg:grid-cols-2', className)}
    >
      {/* Image Section - Hidden on mobile, shown on desktop */}
      <div
        className={cn(
          'relative hidden overflow-hidden bg-surface-container lg:block',
          reverse ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover object-center'
          priority
          sizes='(max-width: 1024px) 0px, 50vw'
        />
        {/* Optional overlay for better text contrast if needed */}
        {showOverlay && (
          <div className='absolute inset-0 bg-gradient-to-r from-black/10 to-transparent' />
        )}
      </div>

      {/* Form Section - Full width on mobile, half on desktop */}
      <div
        className={cn(
          'flex items-center justify-center px-4 py-8 lg:px-8',
          'min-h-screen bg-surface',
          reverse ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl'>
          {showLogo && (
            <div className='px-6'>
              <Link href={logoHref} className='inline-block'>
                <Logo className='w-auto' />
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Alternative layout with different proportions
 * Image takes up 60% on large screens, form takes 40%
 */
export function AuthLayoutWide({
  children,
  imageSrc = '/assets/auth/login-side-image.webp',
  imageAlt = 'Abstract image',
  className,
  reverse = false,
  showLogo = true,
  logoHref = '/',
}: AuthLayoutProps) {
  return (
    <div
      className={cn('min-h-screen w-full lg:grid lg:grid-cols-5', className)}
    >
      {/* Image Section - Hidden on mobile, 3/5 width on desktop */}
      <div
        className={cn(
          'relative hidden overflow-hidden bg-surface-container lg:col-span-3 lg:block',
          reverse ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover object-center'
          priority
          sizes='(max-width: 1024px) 0px, 60vw'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/5 to-transparent' />
      </div>

      {/* Form Section - Full width on mobile, 2/5 on desktop */}
      <div
        className={cn(
          'flex items-center justify-center px-4 py-8 lg:col-span-2 lg:px-8',
          'min-h-screen bg-surface',
          reverse ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        <div className='w-full max-w-md lg:max-w-lg'>
          {showLogo && (
            <div className='px-6'>
              <Link href={logoHref} className='inline-block'>
                <Logo className='w-auto' />
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact layout for simpler forms
 * Smaller form container with more padding
 */
export function AuthLayoutCompact({
  children,
  imageSrc = '/assets/auth/login-side-image.webp',
  imageAlt = 'Abstract image',
  className,
  reverse = false,
  showLogo = true,
  logoHref = '/',
}: AuthLayoutProps) {
  return (
    <div
      className={cn('min-h-screen w-full lg:grid lg:grid-cols-3', className)}
    >
      {/* Image Section - Hidden on mobile, 2/3 width on desktop */}
      <div
        className={cn(
          'relative hidden overflow-hidden bg-surface-container lg:col-span-2 lg:block',
          reverse ? 'lg:order-2' : 'lg:order-1',
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover object-center'
          priority
          sizes='(max-width: 1024px) 0px, 66.67vw'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/5 to-transparent' />
      </div>

      {/* Form Section - Full width on mobile, 1/3 on desktop */}
      <div
        className={cn(
          'flex items-center justify-center px-4 py-8 lg:col-span-1 lg:px-12',
          'min-h-screen bg-surface',
          reverse ? 'lg:order-1' : 'lg:order-2',
        )}
      >
        <div className='w-full max-w-sm'>
          {showLogo && (
            <div className='px-6'>
              <Link href={logoHref} className='inline-block'>
                <Logo className='w-auto' />
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
