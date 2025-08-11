/**
 * Renders the top navigation bar.
 *
 * Includes the site logo, navigation links, and primary action buttons.
 */
import Link from 'next/link';
import NavActions from './nav-actions';

import Logo from '@/app/components/ui/logo';
import { NavList, NavLink } from './nav-items';

export default function TopNav() {
  return (
    <nav className='flex h-20 items-center justify-between gap-4 px-[72px] py-[18px]'>
      <Link href="/" className="inline-block">
        <Logo />
      </Link>
      <div className='flex w-full justify-center'>
        <NavList>
          <NavLink ariaLabel='Home Page' href='/'>
            Home
          </NavLink>
          <NavLink ariaLabel='Pricing Page' href='/pricing'>
            Pricing
          </NavLink>
          <NavLink ariaLabel='Learn More Page' href='/learn-more'>
            Learn More
          </NavLink>
          <NavLink ariaLabel='Contact Page' href='/contact'>
            Contact
          </NavLink>
        </NavList>
      </div>
      <NavActions />
    </nav>
  );
}
