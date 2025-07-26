'use client';

// ---Core Framework---------------------------------------------------
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWatch } from 'react-hook-form';

// ---Hooks------------------------------------------------------------
import { useLoginForm, useOtpForm } from '../hooks/use-login-form';

// ---Types-------------------------------------------------------------
import type { LoginFormData } from '../types/login-form-data';
import type { OtpFormData } from '../types/login-form-data';

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

// ---Constants--------------------------------------------------------
enum Step {
  INITIAL = 1,
  REQUIRE_OTP = 2,
}

/**
 * Main login form component that handles two-step authentication flow:
 * 1. Initial step: Email and password validation
 * 2. OTP step: Two-factor authentication (if enabled)
 */
export default function LoginForm() {
  // ---State Management-------------------------------------------------
  const [step, setStep] = useState(Step.INITIAL);
  const otpInputRef = useRef<HTMLInputElement>(null);
  
  // ---Form Hooks-------------------------------------------------------
  const form = useLoginForm();
  const otpForm = useOtpForm();
  
  // ---Router & Navigation----------------------------------------------
  const router = useRouter();
  const isSubmitting = form.formState.isSubmitting;

  // ---Dynamic Password Reset Link-------------------------------------
  // Watch the email field to create a dynamic link for password reset
  const watchedEmail = useWatch({ control: form.control, name: 'email' });
  const resetPasswordHref = watchedEmail
    ? `/password-reset?email=${encodeURIComponent(watchedEmail)}`
    : '/password-reset';

  // ---Effects----------------------------------------------------------
  /**
   * Auto-focus the OTP input when transitioning to the OTP step.
   * Uses requestAnimationFrame to ensure the input is rendered first.
   */
  useEffect(() => {
    if (step === Step.REQUIRE_OTP && otpInputRef.current) {
      const raf = requestAnimationFrame(() => {
        otpInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [step]);

  // ---Event Handlers--------------------------------------------------
  /**
   * Handles the initial login form submission (email and password).
   * Performs pre-login check and determines if OTP is required.
   */
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

  /**
   * Handles OTP form submission for two-factor authentication.
   * Combines email/password from the initial form with the OTP token.
   */
  const handleOTPSubmit = async (data: OtpFormData) => {
    const response = await loginWithCredentials({
      email: form.getValues('email'),
      password: form.getValues('password'),
      token: data.otp,
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

  // ---Render-----------------------------------------------------------
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
          otpForm={otpForm}
          handleOTPSubmit={handleOTPSubmit}
          ref={otpInputRef}
        />
      )}
    </>
  );
}

// ---Sub-Components---------------------------------------------------

/**
 * LoginCard Component
 * 
 * Renders the initial login form with email and password fields.
 * Includes form validation, error handling, and navigation links.
 */
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
                  loading={isSubmitting}
                  loadingText='Logging in...'
                  className='w-full'
                  type='submit'
                  variant='filled'
                >
                  Login
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

/**
 * OtpCard Component
 * 
 * Renders the OTP verification form for two-factor authentication.
 * Uses InputOTP component for 6-digit code entry with validation.
 */
interface OtpCardProps {
  otpForm: ReturnType<typeof useOtpForm>;
  handleOTPSubmit: (data: OtpFormData) => Promise<void>;
  ref: React.RefObject<HTMLInputElement | null>;
}

function OtpCard({ otpForm, handleOTPSubmit, ref }: OtpCardProps) {
  const isOtpSubmitting = otpForm.formState.isSubmitting;

  return (
    <Card className='w-[720px] shadow-elevation-0'>
      <CardHeader>
        <CardTitle>One-Time Passcode</CardTitle>
        <CardDescription className='typescale-body-large'>
          {`Enter the one-time passcode for ${process.env.APP_NAME} displayed in your authenticator app`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...otpForm}>
          <form className='flex flex-col gap-2' onSubmit={otpForm.handleSubmit(handleOTPSubmit)}>
            <p className='text-muted-foreground text-xs'>
              Please enter the one-time passcode from the Google Authenticator
              app.
            </p>
            <FormField
              name='otp'
              control={otpForm.control}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP 
                      ref={ref} 
                      maxLength={6} 
                      value={field.value} 
                      onChange={field.onChange}
                    >
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
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button 
              loading={isOtpSubmitting}
              loadingText='Verifying OTP...'
              type='submit' 
              disabled={otpForm.watch('otp').length !== 6}
            >
              Verify OTP
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
