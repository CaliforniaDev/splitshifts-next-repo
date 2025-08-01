'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { usePasswordResetForm } from '../hooks/useResetForm';
import { resetPassword } from '../actions/send-password-reset-link';
import { PasswordResetFormData } from '../types/password-reset-form-data';
import { Loader } from 'lucide-react';

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
import AnimatedCheckIcon from '@/app/components/ui/icons/animated-check-icon';
import { maskEmail } from '@/app/lib/utils';

export default function PasswordResetPageForm() {
  const form = usePasswordResetForm();
  const { formState } = form;
  const { isSubmitting, isSubmitSuccessful } = formState;
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the email input when component mounts for better UX
  useEffect(() => {
    if (!isSubmitSuccessful && emailInputRef.current) {
      const raf = requestAnimationFrame(() => {
        emailInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isSubmitSuccessful]);

  const handleSubmit = async (data: PasswordResetFormData) => {
    await resetPassword(data.email);
  };
  return isSubmitSuccessful ? (
    <ResetPasswordSuccessCard form={form} />
  ) : (
    <ResetPasswordFormCard
      form={form}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      emailInputRef={emailInputRef}
    />
  );
}

interface Props {
  form: ReturnType<typeof usePasswordResetForm>;
  handleSubmit: (data: PasswordResetFormData) => Promise<void>;
  isSubmitting: boolean;
  emailInputRef: React.RefObject<HTMLInputElement | null>;
}

function ResetPasswordSuccessCard({ form }: Pick<Props, 'form'>) {
  const email = form.getValues('email');
  const maskedEmail = maskEmail(email);
  return (
    <Card className='w-full border-none shadow-elevation-0'>
      <CardHeader>
        <AnimatedCheckIcon size="medium" className="mb-4" />
        <CardTitle className="text-center">Password Reset Link Sent</CardTitle>
        <CardDescription className="text-center">
          Check your email for the password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent role='status' aria-live='polite' className="text-center">
        If you have an account with us, you will receive a password reset link
        via email at{' '}
        <span className='font-semibold text-on-surface-variant'>
          {maskedEmail}
        </span>
        .
      </CardContent>
    </Card>
  );
}

function ResetPasswordFormCard({ form, handleSubmit, isSubmitting, emailInputRef }: Props) {
  return (
    <Card className='w-full border-none shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Password Reset</CardTitle>
        <CardDescription>
          Enter your email address to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='flex flex-col'
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <fieldset disabled={isSubmitting} className='space-y-8'>
              <FormField
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        ref={emailInputRef}
                        label='Email *'
                        type='email'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!!form.formState.errors.root?.message && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
              )}
              <div className='flex flex-col gap-4'>
                <Button
                  loading={isSubmitting}
                  loadingText='Sending Reset Link...'
                  className='w-full'
                  type='submit'
                  variant='filled'
                >
                  Send Reset Link
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='typescale-body-medium flex flex-col items-end gap-2'>
        <div>
          Remember your password?{' '}
          <Link href='/login' className='underline'>
            Login
          </Link>
        </div>
        <div>
          Don&#39;t have an account?{' '}
          <Link href='/signup' className='underline'>
            Register
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
