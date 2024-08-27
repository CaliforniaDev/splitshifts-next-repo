'use client';

import Button from '@/app/components/ui/buttons/Button';

export default function ButtonGroup() {
  const handleLogIn = () => {
    console.log('Log In!');
  };
  const handleSignUp = () => {
    console.log('Sign Up!');
  };
  return (
    <div
      className='flex w-1/3 gap-4'
      aria-label='Primary call-to-action buttons'
    >
      <Button
        onClick={handleLogIn}
        variant='text'
        aria-label='Log in to your account'
      >
        Log In
      </Button>
      <Button
        onClick={handleSignUp}
        variant='filled'
        aria-label='Sign up for a free account'
      >
        Start for free
      </Button>
    </div>
  );
}
