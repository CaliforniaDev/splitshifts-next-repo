import React from 'react';
import { cn } from '@/app/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const Card: React.FC<CardProps> = ({ className, ref, ...props }) => (
  <div
    ref={ref}
    className={cn(
      'bg-card text-card-foreground rounded-xl border shadow',
      className,
    )}
    {...props}
  />
);

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'typescale-headline-large font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
);

const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn('text-muted-foreground text-sm', className)} {...props} />
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('p-6 pt-0', className)} {...props} />;

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
