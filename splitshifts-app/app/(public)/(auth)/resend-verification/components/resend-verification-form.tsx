'use client';

// ---Core Framework---------------------------------------------------
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

// ---Actions-----------------------------------------------------------
import { sendEmailVerification } from '../../signup/actions/send-email-verification';

// ---Utils------------------------------------------------------------
import { logError } from '@/app/lib/utils';

// ---UI Components-----------------------------------------------------
import Button from '@/app/components/ui/buttons/button';
import Input from '@/app/components/ui/inputs/input';
import AnimatedCheckIcon from '@/app/components/ui/icons/animated-check-icon';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/app/components/ui/card';

// ---Types-------------------------------------------------------------
interface ResendFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  emailInputRef: React.RefObject<HTMLInputElement | null>;
}

interface SuccessCardProps {
  message: string;
  onSendAnother: () => void;
}

/**
 * Main resend verification form component that handles email verification resend flow:
 * 1. Initial step: Email input and validation
 * 2. Success step: Confirmation with options to send another or return to login
 */
export default function ResendVerificationForm() {
  // ---State Management-------------------------------------------------
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const emailInputRef = useRef<HTMLInputElement>(null);

  // ---Effects----------------------------------------------------------
  /**
   * Pre-fill email from URL params if available for better UX
   */
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  /**
   * Auto-focus the email input when component mounts for better UX
   */
  useEffect(() => {
    if (status !== 'success' && emailInputRef.current) {
      const raf = requestAnimationFrame(() => {
        emailInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [status]);

  // ---Event Handlers--------------------------------------------------
  /**
   * Handles the resend verification form submission.
   * Validates email and calls the sendEmailVerification action.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');

    try {
      const result = await sendEmailVerification(email.trim());

      if (result?.success) {
        setStatus('success');
        setMessage('Verification email sent successfully! Please check your inbox.');
      } else if (result?.error) {
        setStatus('error');
        setMessage(result.message || 'Failed to send verification email.');
      } else {
        // No result means user doesn't exist, but we don't reveal this for security
        setStatus('success');
        setMessage('If an account exists with this email, a verification link has been sent.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
      logError('Resend verification error', error);
    }
  };

  /**
   * Resets the form to send another verification email
   */
  const handleSendAnother = () => {
    setStatus('idle');
    setMessage('');
    setEmail('');
  };

  // ---Render-----------------------------------------------------------
  return (
    <>
      {status === 'success' && (
        <ResendVerificationSuccessCard 
          message={message} 
          onSendAnother={handleSendAnother} 
        />
      )}
      {status !== 'success' && (
        <ResendVerificationFormCard
          email={email}
          setEmail={setEmail}
          onSubmit={handleSubmit}
          status={status}
          message={message}
          emailInputRef={emailInputRef}
        />
      )}
    </>
  );
}

// ---Sub-Components---------------------------------------------------

/**
 * ResendVerificationSuccessCard Component
 *
 * Renders the success state after verification email is sent.
 * Includes animated checkmark celebration and options to continue.
 */
function ResendVerificationSuccessCard({ 
  message, 
  onSendAnother 
}: SuccessCardProps) {
  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader aria-live="polite" role="status">
        <AnimatedCheckIcon size="medium" className="mb-4" />
        <CardTitle className="text-center animate-fade-in-up [animation-delay:0.3s] opacity-0">
          Email Sent!
        </CardTitle>
        <CardDescription className="typescale-body-large text-center animate-fade-in-up [animation-delay:0.4s] opacity-0">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 animate-fade-in-up [animation-delay:0.5s] opacity-0">
        <Link href="/login">
          <Button variant="filled" className="w-full">
            Back to Login
          </Button>
        </Link>
        <Button
          variant="outlined"
          className="w-full"
          onClick={onSendAnother}
        >
          Send Another Email
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * ResendVerificationFormCard Component
 *
 * Renders the main form for resending verification emails.
 * Includes email input, validation, error handling, and navigation.
 */
function ResendVerificationFormCard({ 
  email, 
  setEmail, 
  onSubmit, 
  status, 
  message,
  emailInputRef
}: ResendFormProps) {
  const isLoading = status === 'loading';

  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader>
        <CardTitle>Resend Verification Email</CardTitle>
        <CardDescription className="typescale-body-large">
          Enter your email address to receive a new verification link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form 
          className="flex flex-col"
          onSubmit={onSubmit}
        >
          <fieldset disabled={isLoading} className="space-y-4">
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              error={status === 'error'}
              errorMessage={status === 'error' ? message : ''}
              ref={emailInputRef}
            />

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                variant="filled"
                className="w-full"
                loading={isLoading}
                loadingText="Sending..."
              >
                Send Verification Email
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
      <CardFooter className='typescale-body-medium flex flex-col items-end gap-2'>
        <Link
          href="/login"
          className="underline hover:text-primary hover:font-semibold transition-all duration-200"
        >
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
