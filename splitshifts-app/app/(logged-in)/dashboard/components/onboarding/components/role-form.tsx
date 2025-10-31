'use client';
import { useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createRolesSchema,
  type CreateRolesFormData,
} from '@/app/lib/validation/roles';

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
import { Input, Textarea } from '@/app/components/ui/inputs';
import Button from '@/app/components/ui/buttons/button';
import { addRoles } from '@/app/(logged-in)/dashboard/actions/worksite/add-roles';
import WarningIcon from '@/app/components/ui/icons/warning-icon';

interface RoleFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function RoleForm({ onSuccess, onBack }: RoleFormProps) {
  const { toast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isAddingAnother, setIsAddingAnother] = useState(false);

  const form = useForm<CreateRolesFormData>({
    resolver: zodResolver(createRolesSchema),
    defaultValues: {
      title: '',
      description: '',
      hourlyRate: undefined,
      requirements: {
        minimumAge: undefined,
        requiredCertifications: [],
        physicalRequirements: [],
        equipmentProvided: [],
        specialSkills: [],
      },
    },
  });

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleSubmit = async (data: CreateRolesFormData, addAnother = false) => {
    if (addAnother) {
      setIsAddingAnother(true);
    }
    
    try {
      const response = await addRoles(data);
      if (!response.success) {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to add role',
        });
        return;
      }
      if (addAnother) {
        form.reset();
        toast({
          title: 'Success',
          description: 'Role added! Add another or continue.',
        });
        return;
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to add role:', error);
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
        <CardTitle>Create Roles</CardTitle>
        <CardDescription>
          Create the roles you want to assign later for each member of your
          organization.
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
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        ref={nameInputRef}
                        label='Role Title *'
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
                      <Textarea
                        {...field}
                        label='Description (Optional)'
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
                  loadingText='Adding Role...'
                  disabled={isSubmitting || isAddingAnother}
                >
                  Add Another Role
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
