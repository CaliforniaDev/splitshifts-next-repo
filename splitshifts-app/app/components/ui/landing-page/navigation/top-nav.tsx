/**
 * Renders the top navigation bar.
 *
 * Includes the site logo, navigation links, and primary action buttons.
 */

import Logo from '@/app/components/ui/logo';
import Button from '@/app/components/ui/buttons/button';
import { NavList, NavLink } from './nav-items';

export default function TopNav() {
  return (
    <nav className='flex h-20 items-center justify-between gap-4 px-[72px] py-[18px]'>
      <Logo />
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
      <form
        className='flex w-1/3 gap-4'
        aria-label='Primary call-to-action links'
      >
        <Button
          as='next-link'
          href='/login'
          variant='text'
          aria-label='Log in to your account'
        >
          Log In
        </Button>
        <Button
          as='next-link'
          href='/signup'
          variant='filled'
          aria-label='Sign up for a new account'
        >
          Start for free
        </Button>
      </form>
    </nav>
  );
}
