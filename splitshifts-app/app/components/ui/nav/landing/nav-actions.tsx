import Button from '@/app/components/ui/buttons/button';

export default function NavActions() {
  return (
    <div className='flex gap-4 flex-shrink-0' aria-label='Primary call-to-action links'>
      <Button
        as='next-link'
        href='/login'
        variant='text'
        aria-label='Log in to your account'
      >
        Log In
      </Button>
      <Button
        as='next-link'
        href='/signup'
        variant='filled'
        aria-label='Sign up for a new account'
      >
        Sign Up Now
      </Button>
    </div>
  );
}
