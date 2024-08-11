import type { Metadata } from 'next';
import { inter, spaceGrotesk } from '@/app/components/ui/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'SplitShifts',
  description:
    'A web application designed to streamline the scheduling process for organizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>{children}
      </body>
    </html>
  );
}
