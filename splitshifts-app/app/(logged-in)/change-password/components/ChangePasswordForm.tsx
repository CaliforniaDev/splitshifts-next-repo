// File: app/(logged-in)/change-password/page.tsx
'use client';

import { changePassword } from '../actions/change-password';

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
import { ChangePasswordData } from '../types/change-password-data';
import { useChangePasswordForm } from '../hooks/use-change-password-form';
import Button from '@/app/components/ui/buttons/button';
import Input from '@/app/components/ui/inputs/input';
import { useToast } from '@/app/components/ui/toast';

export default function ChangePasswordForm() {
  const { toast } = useToast();
  const form = useChangePasswordForm();
  const isSubmitting = form.formState.isSubmitting;
  const handleSubmit = async (data: ChangePasswordData) => {
    const response = await changePassword({
      currentPassword: data.currentPassword,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.error) {
      form.setError('root', {
        message: response.message,
      });
    } else {
      toast({
        description: 'Your password has been successfully updated.',
      });
      form.reset();
    }
  };
  return (
    <Card className='w-[750px] shadow-elevation-0'>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset disabled={isSubmitting} className='space-y-8'>
              <FormField
                name='currentPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Current Password *'
                        type='password'
                        error={!!fieldState.error}
                        onBlur={field.onBlur}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name='password'
                control={form.control}
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
                control={form.control}
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
              {!!form.formState.errors.root?.message && (
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
              )}
              <Button
                disabled={isSubmitting}
                className='w-full'
                type='submit'
                variant='filled'
              >
                {isSubmitting ? 'Submitting...' : 'Change Password'}
              </Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
