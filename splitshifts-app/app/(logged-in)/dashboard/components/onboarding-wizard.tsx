'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { cva } from 'class-variance-authority';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from '@/app/lib/validation/organization';
import { createOrganization } from '@/app/(logged-in)/dashboard/actions/create-organization';

import OrganizationFormCard from './organization-form-card';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';

import Input from '@/app/components/ui/inputs/input';
import Button from '@/app/components/ui/buttons/button';
import AnimatedTransition from '@/app/components/ui/animations/animated-transition';

// Step configuration - single source of truth
const STEP_DISPLAY_CONFIG = [
  {
    key: 'organization',
    title: 'Organization',
    description: 'Create your organization',
  },
  {
    key: 'worksite',
    title: 'Worksite',
    description: 'Add your first worksite',
  },
  { key: 'roles', title: 'Roles', description: 'Create job roles' },
  { key: 'employees', title: 'Employees', description: 'Add employees' },
] as const;

// CVA variants
const stepIndicatorVariants = cva(
  'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500',
  {
    variants: {
      active: {
        true: 'bg-secondary-container text-on-secondary-container scale-110',
        false: 'bg-on-surface/16 text-on-surface-variant opacity-30 scale-100',
      },
    },
    defaultVariants: { active: false },
  },
);

const stepTextVariants = cva('typescale-label-large', {
  variants: {
    active: {
      true: 'text-on-surface typescale-body-medium-prominent',
      false: 'text-on-surface-variant opacity-70',
    },
  },
  defaultVariants: { active: false },
});

// Progress header component for all steps
function StepProgress({ currentStepNumber }: { currentStepNumber: number }) {
  return (
    <div className='mb-6 px-4'>
      <nav aria-label='Progress'>
        <ol className='flex w-full items-center'>
          {STEP_DISPLAY_CONFIG.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStepNumber > stepNumber;
            const isActive = currentStepNumber === stepNumber;
            const isLast = index === STEP_DISPLAY_CONFIG.length - 1;

            return (
              <li
                key={step.key}
                className='flex flex-1 items-center last:flex-none'
              >
                <div className='flex flex-shrink-0 items-center'>
                  <div
                    className={stepIndicatorVariants({
                      active: isActive || isCompleted,
                    })}
                  >
                    <span className='typescale-label-small'>{stepNumber}</span>
                  </div>
                  <span
                    className={clsx(
                      'typescale-body-small ml-2 whitespace-nowrap transition-colors duration-300',
                      isActive || isCompleted
                        ? 'text-on-surface'
                        : 'text-on-surface-variant',
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {!isLast && (
                  <div className='relative mx-4 h-1 min-w-8 flex-1 overflow-hidden rounded-full bg-outline/50'>
                    <div
                      className={clsx(
                        'absolute inset-0 h-full rounded-full bg-secondary transition-all duration-700 ease-out',
                        isCompleted ? 'w-full' : 'w-0',
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

// Reusable placeholder card component
function PlaceholderStepCard({
  title,
  description,
  icon,
  onContinue,
  buttonText = 'Continue',
}: {
  title: string;
  description: string;
  icon: string;
  onContinue: () => void;
  buttonText?: string;
}) {
  return (
    <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
      <CardHeader className='text-center'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 text-center'>
        <div className='text-4xl'>{icon}</div>
        <p className='text-on-surface-variant'>Form coming soon...</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onContinue} variant='filled' className='w-full'>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

enum OnboardingStep {
  WELCOME = 'welcome',
  ORGANIZATION = 'organization',
  WORKSITE = 'worksite',
  ROLES = 'roles',
  EMPLOYEES = 'employees',
  COMPLETED = 'completed',
}

export function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    OnboardingStep.WELCOME,
  );
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      description: '',
      weekStartDay: 'monday',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Auto-focus name input when form loads
  useEffect(() => {
    if (currentStep === OnboardingStep.ORGANIZATION && nameInputRef.current) {
      const raf = requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [currentStep]);

  // Step completion handlers - in logical flow order
  const handleOrganizationComplete = () => {
    setCurrentStep(OnboardingStep.WORKSITE);
    if (nameInputRef.current) {
      nameInputRef.current.blur(); // Blur the input to avoid focus issues
    }
  };

  const handleWorksiteComplete = () => {
    setCurrentStep(OnboardingStep.ROLES);
  };

  const handleRolesComplete = () => {
    setCurrentStep(OnboardingStep.EMPLOYEES);
  };

  const handleEmployeesComplete = () => {
    setCurrentStep(OnboardingStep.COMPLETED);
  };

  // Form submission handler - depends on completion handlers above
  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      const response = await createOrganization(data);
      if (response.success) {
        handleOrganizationComplete();
      } else {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to create organization',
        });
      }
    } catch {
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred',
      });
    }
  };

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

  // For all other steps, show progress bar outside animation + content inside animation
  return (
    <div>
      <StepProgress currentStepNumber={getStepNumber()} />

      {currentStep === OnboardingStep.ORGANIZATION && (
        <AnimatedTransition animationKey='organization'>
          <OrganizationFormCard
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep(OnboardingStep.WELCOME)}
            nameInputRef={nameInputRef}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.WORKSITE && (
        <AnimatedTransition animationKey='worksite'>
          <PlaceholderStepCard
            title='Add Your First Worksite'
            description='Worksites help organize your shifts by location.'
            icon='🏢'
            onContinue={handleWorksiteComplete}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.ROLES && (
        <AnimatedTransition animationKey='roles'>
          <PlaceholderStepCard
            title='Create Job Roles'
            description='Define the different positions in your organization.'
            icon='👔'
            onContinue={handleRolesComplete}
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.EMPLOYEES && (
        <AnimatedTransition animationKey='employees'>
          <PlaceholderStepCard
            title='Add Employees'
            description='Invite your team members to join your organization.'
            icon='👥'
            onContinue={handleEmployeesComplete}
            buttonText='Complete Setup'
          />
        </AnimatedTransition>
      )}

      {currentStep === OnboardingStep.COMPLETED && (
        <AnimatedTransition animationKey='completed'>
          <Card className='mx-auto w-full max-w-md border-none bg-surface-container-low shadow-elevation-1'>
            <CardHeader className='text-center'>
              <div className='mb-4 text-6xl'>✅</div>
              <CardTitle className='typescale-title-large'>
                Setup Complete!
              </CardTitle>
              <CardDescription className='typescale-body-large'>
                Welcome to SplitShifts. Let's start managing your shifts!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant='filled'
                className='w-full'
                onClick={() => router.refresh()}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </AnimatedTransition>
      )}
    </div>
  );
}

function WelcomeCard({
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
          Let's get you set up in just a few easy steps
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
