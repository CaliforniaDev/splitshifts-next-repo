/**
 * Renders the top navigation component.
 *
 * @returns The rendered top navigation component.
 */
import { NavList, NavLink } from './NavItems';
import ButtonLink from '@/app/components/ui/buttons/ButtonLink';
import Image from 'next/image';
import logo from '@/../public/assets/splitshifts-logo.svg';
import { josefinSans } from '@/app/typeface/fonts';

import ButtonGroup from './ButtonGroup';

const Logo = () => {
  return (
    <div aria-label='Logo ' className='flex w-1/3 items-center gap-2'>
      <Image
        src={logo}
        alt='SplitShifts Logo'
        width={48}
        height={48}
        quality={100}
        priority
      />
      <span
        className={`${josefinSans.className} pt-1.5 text-2xl font-bold text-inverse-surface`}
      >
        SplitShifts
      </span>
    </div>
  );
};

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
      <div
        className='flex w-1/3 gap-4'
        aria-label='Primary call-to-action links'
      >
        <ButtonLink
          href='/login'
          variant='text'
          aria-label='Log in to your account'
        >
          Log In
        </ButtonLink>
        <ButtonLink
          href='/signup'
          variant='filled'
          aria-label='Sign up for a new account'
        >
          Start for free
        </ButtonLink>
      </div>
    </nav>
  );
}
