'use client';

// ---Core Framework---------------------------------------------------
import Link from 'next/link';

// ---Hooks------------------------------------------------------------
import { useLoginForm } from './hooks/use-login-form';

// ---Types-------------------------------------------------------------
import type { LoginFormData } from './types/login-form-data';

// ---Actions-----------------------------------------------------------
import { loginWithCredentials } from './action/login-with-credentials';

// ---UI Components-----------------------------------------------------
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
import Input from '@/app/components/ui/inputs/input';
import Button from '@/app/components/ui/buttons/button';
import LogoutButton from '@/app/components/ui/auth/logout-button';



export default function LogIn() {
  const form = useLoginForm();
  const isSubmitting = form.formState.isSubmitting;
  const isSubmitSuccessful = form.formState.isSubmitSuccessful;

  const handleSubmit = async (data: LoginFormData) => {
    await loginWithCredentials({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <main className='flex min-h-screen justify-center'>
      <Card className='w-[720px] shadow-elevation-0'>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription className='typescale-body-large'>
            Enter your email and password to log in.
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
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          label='Password *'
                          type='password'
                          onBlur={field.onBlur}
                          error={!!fieldState.error}
                          errorMessage={fieldState.error?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className='flex flex-col gap-4'>
                  <Button
                    disabled={isSubmitting}
                    className='w-full'
                    type='submit'
                    variant='filled'
                  >
                    {isSubmitting ? 'logging in' : 'Login'}
                  </Button>
                  <LogoutButton className='w-full' variant='outlined'>
                    Logout
                  </LogoutButton>
                </div>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className='typescale-body-large'>
            Don't have an account? <Link href='/signup'>Click here</Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
