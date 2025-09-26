import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import Button from '@/app/components/ui/buttons/button';

interface CompletionCardProps {
  onContinue: () => void;
}

export default function CompletionCard({ onContinue }: CompletionCardProps) {
  return (
    <Card className='mx-auto w-full max-w-md border-none bg-surface-container-low shadow-elevation-1'>
      <CardHeader className='text-center'>
        <div className='mb-4 text-6xl'>✅</div>
        <CardTitle className='typescale-title-large'>
          Setup Complete!
        </CardTitle>
        <CardDescription className='typescale-body-large'>
          Welcome to SplitShifts. Let&apos;s start managing your shifts!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant='filled'
          className='w-full'
          onClick={onContinue}
        >
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
