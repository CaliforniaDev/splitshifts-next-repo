// Reusable placeholder card component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

import Button from '@/app/components/ui/buttons/button';

export default function PlaceholderStepCard({
  title,
  description,
  icon,
  onContinue,
  buttonText = 'Continue',
}: {
  title: string;
  description: string;
  icon: string;
  onContinue: () => void;
  buttonText?: string;
}) {
  return (
    <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
      <CardHeader className='text-center'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4 text-center'>
        <div className='text-4xl'>{icon}</div>
        <p className='text-on-surface-variant'>Form coming soon...</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onContinue} variant='filled' className='w-full'>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
