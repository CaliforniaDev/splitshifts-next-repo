import Button from '@/app/components/ui/buttons/Button';

export default function Hero() {
  return (
    <section className='flex  flex-col gap-6 text-center text-on-surface'>
      <header className='flex flex-col gap-5'>
        <h1 className='typescale-display-large'>
          Simplify Shift Management,{' '}
          <span className='whitespace-nowrap'>Amplify Efficiency</span>
        </h1>
        <h2 className='typescale-headline-medium'>
          Welcome to SplitShifts - Your Ultimate Scheduling Solution
        </h2>
      </header>
      <div>
        <Button size='large' variant='elevated'>
          Get Started
        </Button>
      </div>
    </section>
  );
}
