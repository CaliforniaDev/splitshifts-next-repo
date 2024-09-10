'use client';

/**
 * NavItems.tsx
 *
 * This file contains components for rendering navigation items.
 * It includes the NavList component for rendering a list of navigation links
 * and the NavLink component for rendering individual navigation links.
 */

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavListProps {
  children: React.ReactNode;
}

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  ariaLabel?: string;
}

/**
 * NavList component.
 *
 * A wrapper component for rendering a list of navigation links.
 *
 * @param {React.ReactNode} children - The navigation items to be displayed within the list.
 * @returns {JSX.Element} The rendered list of navigation items.
 */
export function NavList({ children }: NavListProps) {
  return (
    <ul className='typescale-label-large z-10 flex min-w-max max-w-max gap-14 rounded-full border border-outline-variant px-6 py-2.5'>
      {children}
    </ul>
  );
}

/**
 * NavLink component
 *
 * This component renders a single navigation link.
 *
 * @param {React.ReactNode} children - The content to be displayed within the link.
 * @param {string} href - The URL that the link points to.
 * @param {string} [ariaLabel] - Optional ARIA label for accessibility.
 * @returns {JSX.Element} The rendered navigation link.
 */
export function NavLink({ children, href, ariaLabel }: NavLinkProps) {
  // Get the current pathname
  const pathname = usePathname();

  // Determine if the current link is active by comparing the pathname to the href
  const isActive: boolean = pathname === href;

  return (
    <li
      className={clsx(
        'nav-item transition-all duration-200 active:text-primary active:opacity-100',
        {
          'hover:opacity-40': !isActive,
          'typescale-label-large-prominent text-primary': isActive,
        },
      )}
    >
      <Link
        aria-label={ariaLabel}
        href={href}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    </li>
  );
}
