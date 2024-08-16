'use client';

import Button from '@/app/components/ui/buttons/Button';

export default function ButtonGroup() {
  const handleLogIn = () => {
    console.log('Log In!');
  };
  const handleSignUp = () => {
    console.log('Sign Up!');
  }
  return (
    <div className='flex w-1/3 gap-4'>
      <Button onClick={handleLogIn} variant='text'>
        Log In
      </Button>
      <Button onClick={handleSignUp} variant='filled'>Start for free</Button>
    </div>
  );
}
