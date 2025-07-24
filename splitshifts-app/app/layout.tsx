import './globals.css';
import './typeface/typography.css';
import type { Metadata } from 'next';
import { inter, spaceGrotesk } from '@/app/typeface/fonts';
import { Toaster } from './components/ui/toast';

export const metadata: Metadata = {
  title: 'SplitShifts',
  description:
    'A web application designed to streamline the scheduling process for organizations.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
