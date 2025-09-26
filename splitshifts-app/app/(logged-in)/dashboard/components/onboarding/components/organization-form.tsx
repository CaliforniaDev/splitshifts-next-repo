'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createOrganizationSchema, type CreateOrganizationFormData } from '@/app/lib/validation/organization';
import { createOrganization } from '@/app/(logged-in)/dashboard/actions/create-organization';

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

interface OrganizationFormProps {
  onSuccess: () => void;
  onBack: () => void;
}
export default function OrganizationForm({
  onSuccess,
  onBack,
}: OrganizationFormProps) {
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
  
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      const response = await createOrganization(data);
      if (response.success) {
        onSuccess();
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
                        label='Organization Name *'
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
              <div className='flex flex-col space-y-4 pt-4'>
                <Button
                  type='submit'
                  variant='filled'
                  className='w-full'
                  loading={isSubmitting}
                  loadingText='Creating...'
                >
                  Create Organization
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
