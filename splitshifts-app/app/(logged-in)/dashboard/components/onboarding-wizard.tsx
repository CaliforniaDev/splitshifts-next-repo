'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  WelcomeCard,
  OrganizationForm,
  WorksiteForm,
  PlaceholderCard,
  StepProgress,
  CompletionCard,
  OnboardingStep
} from './onboarding';

import AnimatedTransition from '@/app/components/ui/animations/animated-transition';

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    OnboardingStep.WELCOME,
  );

  const getStepNumber = () => {
    switch (currentStep) {
      case OnboardingStep.WELCOME:
        return 1; // Show step 1 as active when on welcome
      case OnboardingStep.ORGANIZATION:
        return 1; // Stay on step 1 during organization form
      case OnboardingStep.WORKSITE:
        return 2;
      case OnboardingStep.ROLES:
        return 3;
      case OnboardingStep.EMPLOYEES:
        return 4;
      case OnboardingStep.COMPLETED:
        return 4; // All steps complete
      default:
        return 1;
    }
  };

  const handleSkip = () => {
    router.refresh();
  };

  if (currentStep === OnboardingStep.WELCOME) {
    return (
      <AnimatedTransition animationKey='welcome'>
        <WelcomeCard
          onContinue={() => setCurrentStep(OnboardingStep.ORGANIZATION)}
          onSkip={handleSkip}
          currentStepNumber={getStepNumber()}
        />
      </AnimatedTransition>
    );
  }
  return (
    <div>
      <StepProgress currentStepNumber={getStepNumber()} />

      {currentStep === OnboardingStep.ORGANIZATION && (
        <AnimatedTransition animationKey='organization'>
          <OrganizationForm
            onSuccess={() => setCurrentStep(OnboardingStep.WORKSITE)}
            onBack={() => setCurrentStep(OnboardingStep.WELCOME)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.WORKSITE && (
        <AnimatedTransition animationKey='worksite'>
          <WorksiteForm
            onSuccess={() => setCurrentStep(OnboardingStep.ROLES)}
            onBack={() => setCurrentStep(OnboardingStep.ORGANIZATION)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.ROLES && (
        <AnimatedTransition animationKey='roles'>
          <PlaceholderCard
            title='Create Job Roles'
            description='Define the different positions in your organization.'
            icon='👔'
            onContinue={() => setCurrentStep(OnboardingStep.EMPLOYEES)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.EMPLOYEES && (
        <AnimatedTransition animationKey='employees'>
          <PlaceholderCard
            title='Add Employees'
            description='Invite your team members to join your organization.'
            icon='👥'
            onContinue={() => setCurrentStep(OnboardingStep.COMPLETED)}
            buttonText='Complete Setup'
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.COMPLETED && (
        <AnimatedTransition animationKey='completed'>
          <CompletionCard onContinue={() => router.refresh()} />
        </AnimatedTransition>
      )}
    </div>
  );
}

