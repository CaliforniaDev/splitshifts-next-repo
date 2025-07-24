// UpdatePasswordForm.tsx
// Renders the UI for updating a user's password after clicking a reset link.
// If the token is valid, it shows the update form. If not, it shows a link to request a new one.

'use client';

import Link from 'next/link';

// Custom form hook for password update
import { useUpdatePasswordForm } from '../hooks/use-update-password-form';

// Server action to update password via token
import { updatePassword } from '../actions/update-password';

// Toast hook for user feedback
import { useToast } from '@/app/components/ui/toast';

// Types
import type { UpdatePasswordData } from '../types/update-password-form-data';

// UI card components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/card';

// Form structure components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';

// Input & Button components
import Input from '@/app/components/ui/inputs/input';
import Button from '@/app/components/ui/buttons/button';

// Props passed from the server after token validation
type Props = {
  token: string;
  isTokenValid: boolean;
};

/**
 * UpdatePasswordForm
 *
 * Displays a card with either:
 * - The form to update password (if the reset token is valid), or
 * - A link to request another reset token (if invalid or expired).
 */
export default function UpdatePasswordForm({ token, isTokenValid }: Props) {
  return (
    <Card className='w-full max-w-[720px] shadow-elevation-0'>
      <CardHeader>
        <CardTitle>
          {isTokenValid
            ? 'Update Password'
            : 'Your password reset link is invalid or has expired'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTokenValid ? (
          <UpdatePasswordFields token={token} />
        ) : (
          <Link className='underline' href='/password-reset'>
            Request another password reset link
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * UpdatePasswordFields
 *
 * Handles the form rendering, validation, and submission logic
 * using react-hook-form and zod. Displays toast feedback and errors.
 */
function UpdatePasswordFields({ token }: { token: string }) {
  const form = useUpdatePasswordForm();
  const { toast } = useToast();
  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = form;

  /**
   * onSubmit
   *
   * Sends the token and new password to the server.
   * Displays an error if the token is invalid or expired.
   * Resets the form and shows a success toast if successful.
   */
  const onSubmit = async (data: UpdatePasswordData) => {
    const response = await updatePassword({
      token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
    if (response?.tokenInvalid) {
      window.location.reload();
    } else {
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      reset();
    }
  };

  const SubmitSuccessfulMessage = () => (
    <div>
      Your password has been updated.{' '}
      <Link href='/login' className='underline'>
        Click here to login to your account
      </Link>
    </div>
  );

  return isSubmitSuccessful ? (
    <SubmitSuccessfulMessage />
  ) : (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isSubmitting} className='space-y-8'>
          {/* Form fields for password and password confirmation */}
          <FormField
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    label='New Password *'
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
            control={control}
            render={({ field, fieldState }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label='New Password Confirm *'
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
          {!!errors.root?.message && (
            <FormMessage>{errors.root?.message}</FormMessage>
          )}
          <Button
            disabled={isSubmitting}
            className='w-full'
            type='submit'
            variant='filled'
          >
            {isSubmitting ? 'Submitting...' : 'Update Password'}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
