import Image from 'next/image';

import dashboardMockup from '@/../public/assets/mockups/dashboard-light.webp';

import Button from '@/app/components/ui/buttons/button';

export default function Hero() {
  return (
    <section className='flex flex-col gap-6 text-center text-on-surface'>
      <header className='flex flex-col gap-5'>
        <h1 className='typescale-display-large'>
          Simplify Shift Management,{' '}
          <span className='whitespace-nowrap'>Amplify Efficiency</span>
        </h1>
        <h2 className='typescale-headline-medium'>
          Welcome to SplitShifts - Your Ultimate Scheduling Solution
        </h2>
      </header>
      <form>
        <Button type="submit" size='large' variant='elevated'>
          Get Started
        </Button>
      </form>
      <div className='relative mt-6 flex rounded-xl shadow-elevation-1'>
        <Image
          src={dashboardMockup}
          alt='SplitShifts Hero'
          placeholder='blur'
        />
      </div>
    </section>
  );
}
