'use client';

/**
 * Navigation components for the site.
 *
 * - `NavList` renders a list of navigation links.
 * - `NavLink` renders an individual navigation link with active styling.
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
 * NavList component for wrapping navigation links in an unordered list.
 */
export function NavList({ children }: NavListProps) {
  return (
    <ul className='typescale-label-large z-10 flex min-w-max max-w-max gap-14 rounded-full border border-outline-variant px-6 py-2.5'>
      {children}
    </ul>
  );
}

/**
 * NavLink component for rendering individual navigation links.
 *
 * Detects if the current URL matches `href` to highlight active links.
 */
export function NavLink({ children, href, ariaLabel }: NavLinkProps) {
  const pathname = usePathname(); // Get current URL path
  const isActive = pathname === href; // Determine if the link is active

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
