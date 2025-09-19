'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cva } from 'class-variance-authority';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from '@/app/lib/validation/organization';
import { createOrganization } from '@/app/(logged-in)/dashboard/actions/create-organization';

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

// CVA variants
const stepIndicatorVariants = cva(
  'flex h-8 w-8 items-center justify-center rounded-full',
  {
    variants: {
      active: {
        true: 'bg-secondary-container text-on-secondary-container',
        false: 'bg-on-surface/16 text-on-surface-variant opacity-30',
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
  const steps = [
    { text: 'Organization', active: currentStepNumber >= 1 },
    { text: 'Work Site', active: currentStepNumber >= 2 },
    { text: 'Roles', active: currentStepNumber >= 3 },
    { text: 'Employees', active: currentStepNumber >= 4 },
  ];

  return (
    <div className="mb-6 px-4">
      <nav aria-label="Progress" role="progressbar" aria-valuenow={currentStepNumber} aria-valuemin={1} aria-valuemax={4}>
        <ol className="flex items-center w-full">
          {steps.map((step, index) => {
            const isCompleted = currentStepNumber > index + 1;
            const isActive = currentStepNumber === index + 1;
            const isLast = index === steps.length - 1;

            return (
              <li key={index} className="flex items-center flex-1 last:flex-none">
                {/* Step Indicator and Label */}
                <div className="flex items-center flex-shrink-0">
                  <div 
                    className={stepIndicatorVariants({ 
                      active: isActive || isCompleted 
                    })}
                  >
                    <span className="typescale-label-small">{index + 1}</span>
                  </div>
                  <span className={`ml-2 typescale-body-small whitespace-nowrap ${
                    isActive || isCompleted ? 'text-on-surface' : 'text-on-surface-variant'
                  }`}>
                    {step.text}
                  </span>
                </div>
                
                {/* Connecting Line - only show if not last step */}
                {!isLast && (
                  <div 
                    className={`flex-1 min-w-8 h-1 mx-4 rounded-full transition-colors duration-300 ${
                      isCompleted ? 'bg-secondary' : 'bg-outline/50'
                    }`} 
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
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

export function OnBoardingWizard() {
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

  const handleOrganizationComplete = () => {
    setCurrentStep(OnboardingStep.WORKSITE);
    if (nameInputRef.current) {
      nameInputRef.current.blur(); // Blur the input to avoid focus issues
    }
    // Optionally, you can scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWorkSiteComplete = () => {
    setCurrentStep(OnboardingStep.ROLES);
    // Optionally, you can scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRolesComplete = () => {
    setCurrentStep(OnboardingStep.EMPLOYEES);
    // Optionally, you can scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmployeesComplete = () => {
    setCurrentStep(OnboardingStep.COMPLETED);
    // Optionally, you can scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  if (currentStep === OnboardingStep.ORGANIZATION) {
    return (
      <AnimatedTransition animationKey='organization'>
        <div>
          <StepProgress currentStepNumber={getStepNumber()} />
          <OrganizationFormCard
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep(OnboardingStep.WELCOME)}
            nameInputRef={nameInputRef}
          />
        </div>
      </AnimatedTransition>
    );
  }

  if (currentStep === OnboardingStep.WORKSITE) {
    return (
      <AnimatedTransition animationKey='worksite'>
        <div>
          <StepProgress currentStepNumber={getStepNumber()} />
          <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
            <CardHeader className='text-center'>
              <CardTitle>Add Your First Work Site</CardTitle>
              <CardDescription>
                Work sites help organize your shifts by location.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <div className='text-4xl'>🏢</div>
              <p className='text-on-surface-variant'>
                Work site form coming soon...
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleWorkSiteComplete} variant='filled' className='w-full'>
                Continue
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AnimatedTransition>
    );
  }

  if (currentStep === OnboardingStep.ROLES) {
    return (
      <AnimatedTransition animationKey='roles'>
        <div>
          <StepProgress currentStepNumber={getStepNumber()} />
          <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
            <CardHeader className='text-center'>
              <CardTitle>Create Job Roles</CardTitle>
              <CardDescription>
                Define the different positions in your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <div className='text-4xl'>👔</div>
              <p className='text-on-surface-variant'>
                Job roles form coming soon...
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRolesComplete} variant='filled' className='w-full'>
                Continue
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AnimatedTransition>
    );
  }
  if (currentStep === OnboardingStep.EMPLOYEES) {
    return (
      <AnimatedTransition animationKey='employees'>
        <div>
          <StepProgress currentStepNumber={getStepNumber()} />
          <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
            <CardHeader className='text-center'>
              <CardTitle>Add Employees</CardTitle>
              <CardDescription>
                Invite your team members to join your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <div className='text-4xl'>👥</div>
              <p className='text-on-surface-variant'>
                Employee invitation form coming soon...
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleEmployeesComplete} variant='filled' className='w-full'>
                Complete Setup
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AnimatedTransition>
    );
  }

  if (currentStep === OnboardingStep.COMPLETED) {
    return (
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
    );
  }

  return null;
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
  const steps = [
    { text: 'Create your organization', active: currentStepNumber  >= 1 },
    { text: 'Add your first work site', active: currentStepNumber >= 2 },
    { text: 'Create job roles', active: currentStepNumber >= 3 },
    { text: 'Add employees', active: currentStepNumber >= 4 },
  ];

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
          {steps.map((step, index) => (
            <li key={index} className='flex items-center space-x-3'>
              <div className={stepIndicatorVariants({ active: step.active })}>
                <span className='typescale-label-medium'>{index + 1}</span>
              </div>
              <span className={stepTextVariants({ active: step.active })}>
                {step.text}
              </span>
            </li>
          ))}
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

interface OrganizationFormCardProps {
  form: ReturnType<typeof useForm<CreateOrganizationFormData>>;
  isSubmitting: boolean;
  onSubmit: (data: CreateOrganizationFormData) => Promise<void>;
  onBack: () => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
}

function OrganizationFormCard({
  form,
  isSubmitting,
  onSubmit,
  onBack,
  nameInputRef,
}: OrganizationFormCardProps) {
  return (
    <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Create Your Organization</CardTitle>
        <CardDescription>
          Start by providing some basic details about your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form.formState.errors.root && (
          <div className='mb-4'>
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting} className='space-y-4'>
              <FormField
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        ref={nameInputRef}
                        label='Organization Name'
                        type='text'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Description (Optional)'
                        type='text'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='weekStartDay'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <div className='space-y-2'>
                        <label className='typescale-body-medium block text-on-surface'>
                          Week Starts On
                        </label>
                        <select
                          {...field}
                          className={`w-full rounded-lg border p-3 text-on-surface ${
                            fieldState.error
                              ? 'border-error bg-error-container/10'
                              : 'border-outline bg-surface'
                          }`}
                        >
                          <option value='monday'>Monday</option>
                          <option value='sunday'>Sunday</option>
                        </select>
                        {fieldState.error && (
                          <FormMessage>{fieldState.error.message}</FormMessage>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col space-y-3 pt-4'>
        <Button
          type='submit'
          variant='filled'
          className='w-full'
          loading={isSubmitting}
          loadingText='Creating...'
          onClick={form.handleSubmit(onSubmit)}
        >
          Create Organization
        </Button>
        <Button
          type='button'
          variant='outlined'
          className='w-full'
          onClick={onBack}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
