'use client';

// ---Core Framework---------------------------------------------------
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ---Hooks------------------------------------------------------------
import { useLoginForm } from '../hooks/use-login-form';

// ---Types-------------------------------------------------------------
import type { LoginFormData } from '../types/login-form-data';

// ---Actions-----------------------------------------------------------
import { loginWithCredentials } from '../action/login-with-credentials';

// ---UI Components-----------------------------------------------------
import Button from '@/app/components/ui/buttons/button';
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

export default function LoginForm() {
  const form = useLoginForm();
  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (data: LoginFormData) => {
    const response = await loginWithCredentials({
      email: data.email,
      password: data.password,
    });
    if (response?.error) {
      form.setError('root', {
        message: response.message,
      });
    } else {
      router.push('/dashboard');
    }
  };
  return (
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
                        errorMessage={fieldState.error && 'Invalid Password'}
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
                  {isSubmitting ? 'logging in' : 'Login'}
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='typescale-body-medium flex flex-col items-end gap-2'>
        <div>
          Don&#39;t have an account?{' '}
          <Link href='/signup' className='underline'>
            Register
          </Link>
        </div>
        <div>
          Forgot password?{' '}
          <Link href='/password-reset' className='underline'>
            Reset Password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
