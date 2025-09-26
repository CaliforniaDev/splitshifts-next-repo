'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  createWorksiteSchema,
  type CreateWorksiteFormData,
} from '@/app/lib/validation/worksite';
import { TIMEZONE_OPTIONS } from '@/app/lib/utils/timezones';

import {
  Card,
  CardContent,
  CardDescription,
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


interface WorksiteFormCardProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function WorksiteForm({
  onSuccess,
  onBack,
}: WorksiteFormCardProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateWorksiteFormData>({
    resolver: zodResolver(createWorksiteSchema),
    defaultValues: {
      name: '',
      address: '',
      timezone: 'America/New_York', // Default timezone
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleSubmit = async (data: CreateWorksiteFormData) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      const response = { success: true }; // Simulate success response
      if (response.success) {
        onSuccess();
      } else {
        form.setError('root', {
          type: 'server',
          // message: response.error || 'Failed to create worksite',
        });
      }
    } catch {
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred',
      });
    }
  };
  return (
    <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Add Your Worksite</CardTitle>
        <CardDescription>
          Provide details about your primary work location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form.formState.errors.root && (
          <div className='mb-4'>
            <FormMessage>{form.formState.errors.root.message}</FormMessage>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                        label='Worksite Name *'
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
                name='address'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Address *'
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
                name='timezone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <div className='space-y-2'>
                        <label className='typescale-body-medium block text-on-surface'>
                          Timezone *
                        </label>
                        <select
                          {...field}
                          className={`w-full rounded-lg border p-3 text-on-surface ${
                            fieldState.error
                              ? 'border-error bg-error-container/10'
                              : 'border-outline bg-surface'
                          }`}
                        >
                          {TIMEZONE_OPTIONS.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                        {fieldState.error && (
                          <FormMessage>{fieldState.error.message}</FormMessage>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex flex-col space-y-4 pt-4'>
                <Button
                  type='submit'
                  variant='filled'
                  className='w-full'
                  loading={isSubmitting}
                  loadingText='Creating...'
                >
                  Continue
                </Button>
                <Button
                  type='button'
                  variant='outlined'
                  className='w-full'
                  onClick={onBack}
                >
                  Back
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
