'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { saveOnboardingProgress } from '../actions/onboarding';

import {
  WelcomeCard,
  OrganizationForm,
  WorksiteForm,
  RoleForm,
  EmployeeForm,
  StepProgress,
  CompletionCard,
  OnboardingStep,
} from './onboarding';

import AnimatedTransition from '@/app/components/ui/animations/animated-transition';

interface OnboardingWizardProps {
  initialStep?: OnboardingStep | null;
}

export function OnboardingWizard({ initialStep }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    initialStep || OnboardingStep.WELCOME,
  );

  // Save progress whenever step changes
  const handleStepChange = async (newStep: OnboardingStep) => {
    setCurrentStep(newStep);
    await saveOnboardingProgress(newStep);
  };

  const handleComplete = async () => {
    await saveOnboardingProgress(null); // Clear onboarding progress
    router.refresh();
  };

  /**
   * Map onboarding steps to progress indicator numbers (1-4)
   * 
   * Note: Welcome and Organization both show step 1 active because
   * the organization form is the first actual data collection step.
   * The welcome screen is just an introduction.
   */
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

  const handleSkip = async () => {
    await saveOnboardingProgress(null); // Clear onboarding progress
    router.refresh();
  };

  if (currentStep === OnboardingStep.WELCOME) {
    return (
      <AnimatedTransition animationKey='welcome'>
        <WelcomeCard
          onContinue={() => handleStepChange(OnboardingStep.ORGANIZATION)}
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
            onSuccess={() => handleStepChange(OnboardingStep.WORKSITE)}
            onBack={() => handleStepChange(OnboardingStep.WELCOME)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.WORKSITE && (
        <AnimatedTransition animationKey='worksite'>
          <WorksiteForm
            onSuccess={() => handleStepChange(OnboardingStep.ROLES)}
            onBack={() => handleStepChange(OnboardingStep.ORGANIZATION)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.ROLES && (
        <AnimatedTransition animationKey='roles'>
          <RoleForm
            onSuccess={() => handleStepChange(OnboardingStep.EMPLOYEES)}
            onBack={() => handleStepChange(OnboardingStep.WORKSITE)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.EMPLOYEES && (
        <AnimatedTransition animationKey='employees'>
          <EmployeeForm
            onSuccess={() => handleStepChange(OnboardingStep.COMPLETED)}
            onBack={() => handleStepChange(OnboardingStep.ROLES)}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.COMPLETED && (
        <AnimatedTransition animationKey='completed'>
          <CompletionCard onContinue={handleComplete} />
        </AnimatedTransition>
      )}
    </div>
  );
}
