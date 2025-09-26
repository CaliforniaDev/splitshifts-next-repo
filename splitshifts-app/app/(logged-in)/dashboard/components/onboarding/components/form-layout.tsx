import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

interface FormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export default function FormLayout({ 
  title, 
  description, 
  children, 
  className = 'mx-auto w-full max-w-md border-none shadow-elevation-0' 
}: FormLayoutProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
