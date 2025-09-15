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

const stepTextVariants = cva('typescale-body-medium', {
  variants: {
    active: {
      true: 'text-on-surface',
      false: 'text-on-surface-variant',
    },
  },
  defaultVariants: { active: false },
});

export function OnBoardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'form'>('welcome');
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
    if (step === 'form' && nameInputRef.current) {
      const raf = requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [step]);

  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      const response = await createOrganization(data);
      if (response.success) {
        router.refresh();
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

  const handleSkip = () => {
    router.refresh();
  };

  if (step === 'welcome') {
    return (
      <AnimatedTransition animationKey='welcome'>
        <WelcomeCard onContinue={() => setStep('form')} onSkip={handleSkip} />
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition animationKey='form'>
      <OrganizationFormCard
        form={form}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onBack={() => setStep('welcome')}
        nameInputRef={nameInputRef}
      />
    </AnimatedTransition>
  );
}

function WelcomeCard({
  onContinue,
  onSkip,
}: {
  onContinue: () => void;
  onSkip: () => void;
}) {
  const steps = [
    { text: 'Create your organization', active: true },
    { text: 'Add your first location', active: false },
    { text: 'Create job roles', active: false },
    { text: 'Add employees', active: false },
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
