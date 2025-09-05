import Image from 'next/image';

import dashboardMockup from '@/public/assets/mockups/dashboard-light.webp';

import Button from '@/app/components/ui/buttons/button';
import { getBlurredPlaceholder } from '@/app/lib/image-processing';

export default async function Hero() {
  // Use the original file path instead of the optimized .src path
  const { blurDataURL } = await getBlurredPlaceholder('/assets/mockups/dashboard-light.webp', {
    vibrant: true,        
    saturation: 1.8,      // Higher saturation to pull out colors
    brightness: 0.9,      // Slightly darken to avoid white washout
    size: 20,             // Medium size for balance
    quality: 50,          
    blur: 1.5,            // More blur to blend colors
  });
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
        <Button type='submit' size='large' variant='elevated'>
          Get Started
        </Button>
      </form>
      <div className='relative mt-6 flex rounded-xl shadow-elevation-1'>
        <Image
          priority
          src={dashboardMockup}
          alt='SplitShifts Hero'
          placeholder='blur'
          blurDataURL={blurDataURL}
          className='transition-opacity duration-500'
        />
      </div>
    </section>
  );
}
