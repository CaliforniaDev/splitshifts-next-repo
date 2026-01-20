'use client';

import { useEffect, useRef, useState } from 'react';
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
  FormErrorDisplay,
} from '@/app/components/ui/form';

import { useToast } from '@/app/components/ui/toast';
import Input from '@/app/components/ui/inputs/input';
import { SelectMenu } from '@/app/components/ui/inputs';
import { Button } from '@/app/components/ui/buttons';
import { addWorksite } from '@/app/(logged-in)/dashboard/actions/worksite/add-worksite';

interface WorksiteFormCardProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function WorksiteForm({
  onSuccess,
  onBack,
}: WorksiteFormCardProps) {
  const { toast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isAddingAnother, setIsAddingAnother] = useState(false);

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

  const handleSubmit = async (data: CreateWorksiteFormData, addAnother = false) => {
    if (addAnother) {
      setIsAddingAnother(true);
    }
    
    try {
      const response = await addWorksite(data);
      if (!response.success) {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to create worksite',
        });
        return;
      }
      if (addAnother) {
        form.reset();
        toast({
          title: 'Success',
          description: 'Worksite added! Add another or continue.',
        });
        return;
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to create worksite:', error);
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
  return (
    <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Add Your Worksite</CardTitle>
        <CardDescription>
          Provide details about your primary work location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => handleSubmit(data, false))}>
            <fieldset disabled={isSubmitting} className='space-y-8'>
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
                      <SelectMenu
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        label='Timezone *'
                        options={TIMEZONE_OPTIONS}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.formState.errors.root?.message && (
                <FormErrorDisplay>
                  {form.formState.errors.root.message}
                </FormErrorDisplay>
              )}
              <div className='flex flex-col space-y-4 pt-4'>
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
                  variant='outlined'
                  className='w-full'
                  onClick={form.handleSubmit((data) => handleSubmit(data, true))}
                  loading={isAddingAnother}
                  loadingText='Adding Worksite...'
                  disabled={isSubmitting || isAddingAnother}
                >
                  Add Another Worksite
                </Button>
                <div className='flex gap-4'>
                  <Button
                    type='button'
                    variant='text'
                    className='flex-1'
                    onClick={onBack}
                    disabled={isSubmitting || isAddingAnother}
                  >
                    Back
                  </Button>
                  <Button
                    type='button'
                    variant='text'
                    className='flex-1'
                    onClick={onSuccess}
                    disabled={isSubmitting || isAddingAnother}
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent> 
    </Card>
  );
}
