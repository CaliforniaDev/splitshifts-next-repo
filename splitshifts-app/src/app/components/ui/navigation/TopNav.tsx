import Button from '@/app/components/ui/buttons/Button';

export default function TopNav() {
  return (
    <nav className='flex h-20 items-center justify-between gap-4 px-[72px]'>
      <div className='w-1/3'>
        <h1>SplitShifts</h1>
      </div>
      <div className='flex w-full justify-center'>
        <ul className='typescale-label-large z-10 flex min-w-max max-w-max gap-14 rounded-full border border-outline-variant px-6 py-2.5'>
          <li className='typescale-label-large-prominent text-primary'>
            <a href='/'>Home</a>
          </li>
          <li>
            <a href='/pricing'>Pricing</a>
          </li>
          <li>
            <a href='/learn-more'>Learn More</a>
          </li>
          <li>
            <a href='/contact'>Contact</a>
          </li>
        </ul>
      </div>
      <div className='call-to-action flex w-1/3 gap-4'>
        <Button variant='text'> Log In</Button>
        <Button variant='filled'>Start for free</Button>
      </div>
    </nav>
  );
}
