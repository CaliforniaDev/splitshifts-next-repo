import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import { josefinSans } from '@/app/typeface/fonts';
import logo from '@/public/assets/splitshifts-logo.svg';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  textClassName?: string;
}

export default function Logo({
  width = 48,
  height = 48,
  className,
  textClassName,
}: LogoProps) {
  return (
    <div
      aria-label='Logo'
      className={cn('flex w-1/3 items-center gap-2', className)}
    >
      <Image
        src={logo}
        alt='SplitShifts Logo'
        width={width}
        height={height}
        quality={100}
        priority
      />
      <span
        className={cn(
          josefinSans.className,
          'pt-1.5 text-2xl font-bold text-inverse-surface',
          textClassName,
        )}
      >
        SplitShifts
      </span>
    </div>
  );
}
