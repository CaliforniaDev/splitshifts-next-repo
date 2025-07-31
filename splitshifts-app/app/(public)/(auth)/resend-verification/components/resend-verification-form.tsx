'use client';

// ---Core Framework---------------------------------------------------
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// ---Actions-----------------------------------------------------------
import { sendEmailVerification } from '../../signup/actions/send-email-verification';

// ---UI Components-----------------------------------------------------
import Button from '@/app/components/ui/buttons/button';
import Input from '@/app/components/ui/inputs/input';
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
      console.error('Resend verification error:', error instanceof Error ? error.message : String(error));
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
 * Includes options to return to login or send another email.
 */
function ResendVerificationSuccessCard({ 
  message, 
  onSendAnother 
}: SuccessCardProps) {
  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader aria-live="polite" role="status">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <CardTitle className="text-center">Email Sent!</CardTitle>
        <CardDescription className="typescale-body-large text-center">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
  message 
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
