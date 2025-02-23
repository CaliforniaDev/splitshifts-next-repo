import Image from 'next/image';
import { josefinSans } from '@/app/typeface/fonts';
import logo from '@/public/assets/splitshifts-logo.svg';

export default function Logo() {
  return (
    <div aria-label='Logo' className='flex w-1/3 items-center gap-2'>
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
}
