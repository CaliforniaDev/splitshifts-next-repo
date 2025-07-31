'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail } from '../actions/verify-email';

import Button from '@/app/components/ui/buttons/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

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
          setEmail(result.email || '');
        } else {
          setStatus('error');
          setMessage(result?.message || 'An error occurred during verification.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        console.error('Email verification error:', error instanceof Error ? error.message : String(error));
      }
    };

    handleVerification();
  }, [searchParams]);

  if (status === 'loading') {
    return <VerifyEmailLoadingCard />;
  }

  if (status === 'success') {
    return <VerifyEmailSuccessCard message={message} email={email} />;
  }

  return <VerifyEmailErrorCard message={message} />;
}

function VerifyEmailLoadingCard() {
  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader className="text-center">
        <div className="mb-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
        </div>
        <CardTitle>Verifying Email</CardTitle>
        <CardDescription className="typescale-body-large">
          Please wait while we verify your email address...
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

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
