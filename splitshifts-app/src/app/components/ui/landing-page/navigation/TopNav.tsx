import Link from 'next/link';
import Image from 'next/image';
import logo from '@/../public/assets/splitshifts-logo.svg';
import { josefinSans } from '@/app/typeface/fonts';

import ButtonGroup from './ButtonGroup';

export default function TopNav() {
  const Logo = () => {
    return (
      <div className='flex w-1/3 items-center gap-2'>
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

  return (
    <nav className='flex h-20 items-center justify-between gap-4 px-[72px] py-[18px]'>
      <Logo />
      <div className='flex w-full justify-center'>
        <ul className='typescale-label-large z-10 flex min-w-max max-w-max gap-14 rounded-full border border-outline-variant px-6 py-2.5'>
          <li className='typescale-label-large-prominent text-primary'>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/pricing'>Pricing</Link>
          </li>
          <li>
            <a href='/learn-more'>Learn More</a>
          </li>
          <li>
            <a href='/contact'>Contact</a>
          </li>
        </ul>
      </div>
      <ButtonGroup />
    </nav>
  );
}
