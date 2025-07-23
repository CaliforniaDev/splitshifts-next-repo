'use client';

// ---Core Framework---------------------------------------------------
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWatch } from 'react-hook-form';

// ---Hooks------------------------------------------------------------
import { useLoginForm } from '../hooks/use-login-form';

// ---Types-------------------------------------------------------------
import type { LoginFormData } from '../types/login-form-data';

// ---Actions-----------------------------------------------------------
import {
  loginWithCredentials,
  preLoginCheck,
} from '../action/login-with-credentials';

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/app/components/ui/inputs/otp-input';
import { toast } from '@/app/components/ui/toast';

enum Step {
  INITIAL = 1,
  REQUIRE_OTP = 2,
}

export default function LoginForm() {
  const [step, setStep] = useState(Step.INITIAL);
  const [otp, setOtp] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);
  const form = useLoginForm();
  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  // watch the email field to create a dynamic link for password reset
  const watchedEmail = useWatch({ control: form.control, name: 'email' });
  const resetPasswordHref = watchedEmail
    ? `/password-reset?email=${encodeURIComponent(watchedEmail)}`
    : '/password-reset';

  const handleSubmit = async (data: LoginFormData) => {
    const preLoginCheckResponse = await preLoginCheck({
      email: data.email,
      password: data.password,
    });
    if (preLoginCheckResponse.error) {
      form.setError('root', {
        message: preLoginCheckResponse.message,
      });
      return;
    }
    if (preLoginCheckResponse.twoFactorEnabled) {
      setStep(Step.REQUIRE_OTP);
    } else {
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
    }
  };

  useEffect(() => {
    if (step === Step.REQUIRE_OTP && otpInputRef.current) {
      const raf = requestAnimationFrame(() => {
        otpInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [step]);

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginWithCredentials({
      email: form.getValues('email'),
      password: form.getValues('password'),
      token: otp,
    });

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: response.message,
      });
    } else {
      router.push('/dashboard');
    }
  };
  return (
    <>
      {step === Step.INITIAL && (
        <LoginCard
          form={form}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          resetPasswordHref={resetPasswordHref}
        />
      )}
      {step === Step.REQUIRE_OTP && (
        <OtpCard
          handleOTPSubmit={handleOTPSubmit}
          otp={otp}
          setOtp={setOtp}
          ref={otpInputRef}
        />
      )}
    </>
  );
}

// ---Components--------------------------------------------------------
// This component is used to render the login card with form fields and actions.

interface LoginCardProps {
  form: ReturnType<typeof useLoginForm>;
  isSubmitting: boolean;
  handleSubmit: (data: LoginFormData) => Promise<void>;
  resetPasswordHref: string;
}

function LoginCard({
  form,
  isSubmitting,
  handleSubmit,
  resetPasswordHref,
}: LoginCardProps) {
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
          <Link href={resetPasswordHref} className='underline'>
            Reset Password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
// This component is used to render the OTP input card when two-factor authentication is required.
interface OtpCardProps {
  otp: string;
  setOtp: (otp: string) => void;
  handleOTPSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  ref: React.RefObject<HTMLInputElement | null>;
}

function OtpCard({ otp, setOtp, ref, handleOTPSubmit }: OtpCardProps) {
  return (
    <Card className='w-[720px] shadow-elevation-0'>
      <CardHeader>
        <CardTitle>One-Time Passcode</CardTitle>
        <CardDescription className='typescale-body-large'>
          {`Enter the one-time passcode for ${process.env.APP_NAME} displayed in your authenticator app`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className='flex flex-col gap-2' onSubmit={handleOTPSubmit}>
          <p className='text-muted-foreground text-xs'>
            Please enter the one-time passcode from the Google Authenticator
            app.
          </p>
          <InputOTP ref={ref} maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator variant='dash' />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button type='submit' disabled={otp.length !== 6}>
            Verify OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
