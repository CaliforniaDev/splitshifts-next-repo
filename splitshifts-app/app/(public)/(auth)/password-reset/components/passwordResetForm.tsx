'use client';

import Link from 'next/link';

import { usePasswordResetForm } from '../hooks/useResetForm';
import { resetPassword } from '../actions/send-password-reset-link';
import { PasswordResetFormData } from '../types/password-reset-form-data';

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

export default function PasswordResetPageForm() {
  const form = usePasswordResetForm();
  const isSubmitting = form.formState.isSubmitting;
  const handleSubmit = async (data: PasswordResetFormData) => {
    await resetPassword(data.email);
  };
  return (
    <Card className='w-[720px] shadow-elevation-0'>
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
                  disabled={isSubmitting}
                  className='w-full'
                  type='submit'
                  variant='filled'
                >
                  {isSubmitting ? 'Submitting' : 'Submit'}
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
