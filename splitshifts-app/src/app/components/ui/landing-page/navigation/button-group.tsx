/**
 * ButtonGroup component
 *
 * This component renders a group of buttons for primary call-to-action actions.
 * It includes a "Log In" button and a "Start for free" button.
 *
 * The "Log In" button triggers the handleLogIn function, which logs a message to the console.
 * The "Start for free" button triggers the handleSignUp function, which logs a message to the console.
 *
 * This component is marked with 'use client' to indicate that it should be rendered on the client side.
 * This allows the rest of the code to remain on the server, optimizing performance and security.
 *
 */

'use client';

import Button from '@/app/components/ui/buttons/button';

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
