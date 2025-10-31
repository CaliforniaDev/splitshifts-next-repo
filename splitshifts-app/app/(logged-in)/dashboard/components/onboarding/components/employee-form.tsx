'use client';
import { useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createEmployeeSchema,
  type CreateEmployeeFormData,
} from '@/app/lib/validation/employee';

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

import { useToast } from '@/app/components/ui/toast';
import { Input } from '@/app/components/ui/inputs';
import Button from '@/app/components/ui/buttons/button';
import { addEmployee } from '@/app/(logged-in)/dashboard/actions/employee/add-employee';
import WarningIcon from '@/app/components/ui/icons/warning-icon';

interface EmployeeFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function EmployeeForm({ onSuccess, onBack }: EmployeeFormProps) {
  const { toast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isAddingAnother, setIsAddingAnother] = useState(false);

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      hireDate: '',
    },
  });

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleSubmit = async (data: CreateEmployeeFormData, addAnother = false) => {
    if (addAnother) {
      setIsAddingAnother(true);
    }
    
    try {
      const response = await addEmployee(data);
      if (!response.success) {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to add employee',
        });
        return;
      }
      if (addAnother) {
        form.reset();
        toast({
          title: 'Success',
          description: 'Employee added! Add another or continue.',
        });
        return;
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to add employee:', error);
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred',
      });
    } finally {
      if (addAnother) {
        setIsAddingAnother(false);
      }
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Add Employees</CardTitle>
        <CardDescription>
          Add team members to your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {form.formState.errors.root?.message && (
            <div className='mb-4'>
              <ErrorDisplay message={form.formState.errors.root.message} />
            </div>
          )}
          <form onSubmit={form.handleSubmit((data) => handleSubmit(data, false))}>
            <fieldset disabled={isSubmitting} className='space-y-6'>
              <FormField
                name='firstName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        ref={nameInputRef}
                        label='First Name *'
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
                name='lastName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Last Name *'
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
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Email (Optional)'
                        type='email'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='phone'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Phone (Optional)'
                        type='tel'
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
                        label='Address (Optional)'
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
                name='hireDate'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Hire Date (Optional)'
                        type='date'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className='flex flex-col space-y-4 pt-4'>
                <Button
                  type='button'
                  variant='outlined'
                  className='w-full'
                  onClick={form.handleSubmit((data) => handleSubmit(data, true))}
                  loading={isAddingAnother}
                  loadingText='Adding Employee...'
                  disabled={isSubmitting || isAddingAnother}
                >
                  Add Another Employee
                </Button>
                <Button
                  type='submit'
                  variant='filled'
                  className='w-full'
                  loading={isSubmitting && !isAddingAnother}
                  loadingText='Saving & Continuing...'
                  disabled={isAddingAnother}
                >
                  Save & Continue
                </Button>
                <Button
                  type='button'
                  variant='text'
                  className='w-full'
                  onClick={onBack}
                  disabled={isSubmitting || isAddingAnother}
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

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className='rounded-lg border border-error bg-error-container p-4'>
      <div className='flex items-center space-x-3'>
        <div className='flex-shrink-0'>
          <WarningIcon className='h-5 w-5 text-error' />
        </div>
        <div className='flex-1'>
          <p className='typescale-body-medium text-on-error-container'>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
