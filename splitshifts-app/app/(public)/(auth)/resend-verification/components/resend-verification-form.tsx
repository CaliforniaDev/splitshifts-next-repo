'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sendEmailVerification } from '../../signup/actions/send-email-verification';

import Button from '@/app/components/ui/buttons/button';
import TextField from '@/app/components/ui/inputs/text-field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

export default function ResendVerificationForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Pre-fill email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

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

  const handleSendAnother = () => {
    setStatus('idle');
    setMessage('');
    setEmail('');
  };

  if (status === 'success') {
    return <ResendVerificationSuccessCard message={message} onSendAnother={handleSendAnother} />;
  }

  return (
    <ResendVerificationFormCard
      email={email}
      setEmail={setEmail}
      onSubmit={handleSubmit}
      status={status}
      message={message}
    />
  );
}

function ResendVerificationSuccessCard({ 
  message, 
  onSendAnother 
}: { 
  message: string; 
  onSendAnother: () => void; 
}) {
  return (
    <Card className="w-full border-none shadow-elevation-0">
      <CardHeader  aria-live="polite" role="status">
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
        <CardTitle>Email Sent!</CardTitle>
        <CardDescription className="typescale-body-large">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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

interface ResendFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

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
        <form onSubmit={onSubmit}>
          <fieldset disabled={isLoading} className="space-y-4">
            <TextField
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              error={status === 'error' ? message : false}
            />

            <Button
              type="submit"
              variant="filled"
              className="w-full"
              loading={isLoading}
              loadingText="Sending..."
            >
              Send Verification Email
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Back to Login
              </Link>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
