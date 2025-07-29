'use client';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { useSignUpForm } from '../hooks/use-signup-form';
import { registerUser } from '../actions/register-user';

import Button from '@/app/components/ui/buttons/button';
import Input from '@/app/components/ui/inputs/input';

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
} from '@/app/components/ui/form';

import type { SignUpFormData } from '../types/signup-form-data';

export default function SignUpForm() {
  const form = useSignUpForm();
  const isSubmitting = form.formState.isSubmitting;
  const isSubmitSuccessful = form.formState.isSubmitSuccessful;

  const submitHandler = async (data: SignUpFormData) => {
    try {
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
      });

      // Handle field validation errors from API response
      if (response?.error && response?.fieldErrors) {
        Object.entries(response.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof SignUpFormData, { message });
        });
        return; // Exit early after handling field errors
      }

      // Handle general API errors
      if (response?.error) {
        form.setError('root', {
          type: 'server',
          message: response.message || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred. Try again later.',
      });
    }
  };

  return isSubmitSuccessful ? (
    <SignUpSuccessCard />
  ) : (
    <SignUpFormCard
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={submitHandler}
    />
  );
}

function SignUpSuccessCard() {
  return (
    <Card className='w-full border-none shadow-elevation-0'>
      <CardHeader aria-live='polite' role='status'>
        <CardTitle>Registration Successful!</CardTitle>
        <CardDescription className='typescale-body-large'>
          You can now log in to your account!
        </CardDescription>
      </CardHeader>
      <CardContent className='flex'>
        <Button as='next-link' href='/login' className='w-full'>
          Login to your account
        </Button>
      </CardContent>
    </Card>
  );
}

interface Props {
  form: UseFormReturn<SignUpFormData>;
  isSubmitting: boolean;
  onSubmit: (data: SignUpFormData) => Promise<void>;
}

function SignUpFormCard({ form, isSubmitting, onSubmit }: Props) {
  return (
    <Card className='w-full border-none shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Welcome | Sign Up Today</CardTitle>
        <CardDescription className='typescale-body-large'>
          Already have an account? Log In
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isSubmitting} className='space-y-8'>
              <div className='flex space-x-4'>
                <FormField
                  name='firstName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem className='w-1/2'>
                      <FormControl>
                        <Input
                          {...field}
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
                    <FormItem className='w-1/2'>
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
              </div>
              <FormField
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        {...field}
                        label='Email *'
                        type='email'
                        error={!!fieldState.error}
                        onBlur={field.onBlur}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex space-x-4'>
                <FormField
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem className='w-1/2'>
                      <FormControl>
                        <Input
                          {...field}
                          label='Password *'
                          type='password'
                          onBlur={field.onBlur}
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                          supportingText='Your password must be at least 8 characters and contain at least one special character, such as !@#$%^&*().'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='passwordConfirm'
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className='w-1/2'>
                        <FormControl>
                          <Input
                            {...field}
                            label='Confirm Password *'
                            type='password'
                            onBlur={field.onBlur}
                            error={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Button
                loading={isSubmitting}
                loadingText='Submitting...'
                className='w-full'
                type='submit'
                variant='filled'
              >
                Get Started
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='typescale-body-medium flex flex-col items-end gap-2'>
        <div>
          Already have an account?{' '}
          <Link href='/login' className='underline'>
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
