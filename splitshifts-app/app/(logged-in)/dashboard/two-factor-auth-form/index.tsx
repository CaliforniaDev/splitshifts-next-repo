'use client';

import { useState } from 'react';

import { getTwoFactorSecret } from './actions';
import { useToast } from '@/app/components/ui/toast';
import { QRCodeSVG } from 'qrcode.react';
import Button from '@/app/components/ui/buttons/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/app/components/ui/inputs/otp-input';

type Props = {
  twoFactorEnabled: boolean;
};

enum Step {
  ENABLE = 1,
  SHOW_QR_CODE = 2,
  CONFIRM_CODE = 3,
}
export default function TwoFactorAuthForm({ twoFactorEnabled }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState(Step.ENABLE);
  const [code, setCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
  const handleEnableClick = async () => {
    const response = await getTwoFactorSecret();
    const { error, message, twoFactorSecret } = response;
    if (error) {
      toast({
        variant: 'destructive',
        title: message,
      });
      return;
    }

    setStep(Step.SHOW_QR_CODE);
    setCode(twoFactorSecret ?? '');
  };
  
  return (
    <div>
      {!isEnabled && (
        <div>
          {step === 1 && (
            <Button
              variant='filled'
              className='w-full'
              onClick={handleEnableClick}
            >
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div className='flex flex-col items-center gap-4'>
              <p className='typescale-label-medium text-surface-variant py-2'>
                Scan the QR code below in your Google Authenticator app or any
                other compatible app to activate Two-Factor Authentication.
              </p>
              <QRCodeSVG value={code} />
              <Button
                variant='filled'
                className='w-full'
                onClick={() => setStep(Step.CONFIRM_CODE)}
              >
                I have scanned the QR code
              </Button>
              <Button
                variant='outlined'
                className='w-full'
                onClick={() => setStep(Step.ENABLE)}
              >
                Cancel
              </Button>
            </div>
          )}
          {step === Step.CONFIRM_CODE && (
            <form className='flex flex-col gap-2'>
              <p className='text-muted-foreground text-xs'>
                Please enter the one-time passcode from the Google Authenticator
                app.
              </p>
              <InputOTP maxLength={6} >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type='submit'>
                Submit and Activate
              </Button>
              <Button onClick={() => setStep(Step.SHOW_QR_CODE)} variant='outlined'>
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
