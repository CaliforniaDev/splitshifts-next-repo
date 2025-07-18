'use client';

import Button from '@/app/components/ui/buttons/button';
import { useState } from 'react';

type Props = {
  twoFactorEnabled: boolean;
};
export default function TwoFactorAuthForm({ twoFactorEnabled }: Props) {
  const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
  const [step, setStep] = useState(1);
  const handleEnableClick = () => {
    setStep(2);
  };
  return (
    <div>
      {!isEnabled && (
        <div>
          {step === 1 && (
            <Button variant='filled' onClick={handleEnableClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && <div>Display qr code</div>}
        </div>
      )}
    </div>
  );
}
