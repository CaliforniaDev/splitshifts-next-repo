'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import Button from '@/app/components/ui/buttons/button';
import { STEP_DISPLAY_CONFIG, stepIndicatorVariants, stepTextVariants } from '../constants';

export default function WelcomeCard({
  onContinue,
  onSkip,
  currentStepNumber = 1,
}: {
  onContinue: () => void;
  onSkip: () => void;
  currentStepNumber?: number;
}) {
  return (
    <Card className='mx-auto w-full max-w-md border-none bg-surface-container-low shadow-elevation-1'>
      <CardHeader className='text-center'>
        <div className='mb-4 text-6xl'>🎉</div>
        <CardTitle className='typescale-title-large'>
          Welcome to SplitShifts!
        </CardTitle>
        <CardDescription className='typescale-body-large'>
          Let&apos;s get you set up in just a few easy steps
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <ol className='space-y-3'>
          {STEP_DISPLAY_CONFIG.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStepNumber >= stepNumber;

            return (
              <li key={step.key} className='flex items-center space-x-3'>
                <div className={stepIndicatorVariants({ active: isActive })}>
                  <span className='typescale-label-medium'>{stepNumber}</span>
                </div>
                <span className={stepTextVariants({ active: isActive })}>
                  {step.description}
                </span>
              </li>
            );
          })}
        </ol>
        <div className='flex flex-col space-y-3 pt-4'>
          <Button variant='filled' className='w-full' onClick={onContinue}>
            Continue Setup
          </Button>
          <Button variant='outlined' className='w-full' onClick={onSkip}>
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
