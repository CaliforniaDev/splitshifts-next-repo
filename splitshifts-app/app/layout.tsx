import './globals.css';
import './typeface/typography.css';
import type { Metadata } from 'next';
import { inter, spaceGrotesk } from '@/app/typeface/fonts';

import { auth } from '@/auth';
import LogoutButton from './components/ui/auth/logout-button';

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
  const session = await auth();
  return (
    <html
      lang='en'
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className={`${inter.className} antialiased`}>
        <div>
          {session?.user?.email ? (
            <div>
              {session.user.email}
              <LogoutButton>Logout</LogoutButton>
            </div>
          ) : (
            'No Current user logged in'
          )}
        </div>
        {children}
      </body>
    </html>
  );
}
