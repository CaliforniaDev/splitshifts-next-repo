'use client';

// ---Core Framework---------------------------------------------------
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// ---Actions-----------------------------------------------------------
import { verifyEmail } from '../actions/verify-email';

// ---Utils------------------------------------------------------------
import { logError } from '@/app/lib/utils';

// ---UI Components-----------------------------------------------------
import Button from '@/app/components/ui/buttons/button';
import AnimatedTransition from '@/app/components/ui/animations/animated-transition';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

/**
 * Main email verification component that handles token verification flow:
 * 1. Loading state: Shows spinner while verifying token
 * 2. Success state: Displays confirmation with continue to login
 * 3. Error state: Shows error with options to request new email or return to login
 */

export default function VerifyEmailForm() {
  // ---State Management-------------------------------------------------
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  // ---Effects----------------------------------------------------------
  /**
   * Automatically verify email when component mounts using token from URL params
   */
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const handleVerification = async () => {
      try {
        const result = await verifyEmail(token);
        
        if (result?.success) {
          setStatus('success');
          setMessage(result.message);
          setEmail(result.metadata?.email || '');
        } else {
          setStatus('error');
          setMessage(result?.message || 'An error occurred during verification.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        logError('Email verification error', error);
      }
    };

    handleVerification();
  }, [searchParams]);

  // ---Render-----------------------------------------------------------
  if (status === 'loading') {
    return (
      <AnimatedTransition animationKey="loading">
        <VerifyEmailLoadingCard />
      </AnimatedTransition>
    );
  }

  if (status === 'success') {
    return (
      <AnimatedTransition animationKey="success">
        <VerifyEmailSuccessCard message={message} email={email} />
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition animationKey="error">
      <VerifyEmailErrorCard message={message} />
    </AnimatedTransition>
  );
}

// ---Sub-Components---------------------------------------------------

/**
 * VerifyEmailLoadingCard Component
 *
 * Displays a loading spinner while email verification is in progress.
 * Shows animated spinner and informative message to user.
 */
function VerifyEmailLoadingCard() {
  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader className="text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-surface-variant border-t-primary"></div>
        </div>
        <CardTitle>Verifying Email</CardTitle>
        <CardDescription className="typescale-body-large">
          Please wait while we verify your email address...
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

/**
 * VerifyEmailSuccessCard Component
 *
 * Shows successful email verification with celebration checkmark.
 * Includes verified email display and continue to login action.
 */
function VerifyEmailSuccessCard({ message, email }: { message: string; email: string }) {
  const router = useRouter();
  
  const handleContinueToLogin = () => {
    router.push('/login');
  };

  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader className="text-center" aria-live="polite" role="status">
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
        <CardTitle>Email Verified!</CardTitle>
        <CardDescription className="typescale-body-large">
          {message}
        </CardDescription>
        {email && (
          <CardDescription className="text-sm text-gray-500">
            Verified email: <span className="font-medium">{email}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleContinueToLogin}
          variant="filled"
          className="w-full"
        >
          Continue to Login
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * VerifyEmailErrorCard Component
 *
 * Displays error state when email verification fails.
 * Provides options to request new verification email or return to login.
 */
function VerifyEmailErrorCard({ message }: { message: string }) {
  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader className="text-center" aria-live="polite" role="status">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-container">
            <svg
              className="h-6 w-6 text-on-error-container"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <CardTitle>Verification Failed</CardTitle>
        <CardDescription className="typescale-body-large">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Link href="/resend-verification">
          <Button variant="filled" className="w-full">
            Request New Verification Email
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outlined" className="w-full">
            Back to Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
