'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';

import { cn } from '@/app/lib/utils';

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot='input-otp'
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName,
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='input-otp-group'
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot='input-otp-slot'
      data-active={isActive}
      className={cn(
        'data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input shadow-xs relative flex h-9 w-9 items-center justify-center border-y border-r text-sm outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && <FakeCaret />}
    </div>
  );
}

function InputOTPSeparator({
  variant = 'icon', // or use 'cool' as a boolean
  ...props
}: React.ComponentProps<'div'> & { variant?: 'icon' | 'dash' }) {
  return (
    <div data-slot='input-otp-separator' role='separator' {...props}>
      {variant === 'dash' ? <StylishDash /> : <MinusIcon />}
    </div>
  );
}
// FakeCaret: visually emulates a blinking input caret in the active OTP slot
function FakeCaret() {
  return (
    <div className='animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center'>
      <div className='h-4 w-px bg-on-surface duration-1000' />
    </div>
  );
}

function StylishDash() {
  return (
    <div className='flex w-10 items-center justify-center'>
      <div className='h-1 w-3 rounded-full bg-on-surface-variant' />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
