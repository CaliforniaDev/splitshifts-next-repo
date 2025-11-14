// File: app/tests/layout.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { List, ListItemLink } from '@/app/components/ui/nav/dashboard/nav-list';
import { TestIcon } from './icons/test-icon-picker';
import { testNavigation } from './test-nav-config';
import Button from '@/app/components/ui/buttons/button';


export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Fixed Sidebar Navigation */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-y-auto border-r border-outline-variant bg-surface-container lg:block">
        <div className="flex h-full flex-col p-6">
          <div className="mb-8">
            <h2 className="typescale-title-large mb-2">Test Pages</h2>
            <p className="typescale-body-small text-on-surface-variant">
              Component testing & preview
            </p>
          </div>
          
          <nav className="flex-1">
            <List>
              {testNavigation.map(item => {
                const isActive = pathname === item.href;
                
                return (
                  <ListItemLink
                    key={item.name}
                    href={item.href}
                    label={item.name}
                    isActive={isActive}
                    icon={
                      <TestIcon
                        name={item.icon}
                        variant={isActive ? 'solid' : 'outline'}
                      />
                    }
                  />
                );
              })}
            </List>
          </nav>

          <div className="mt-auto space-y-2 border-t border-outline-variant pt-6">
            <Link href="/dashboard">
              <Button variant="text" className="w-full justify-start">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation Header */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-outline-variant bg-surface-container p-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h2 className="typescale-title-medium">Test Pages</h2>
          <Link href="/dashboard">
            <Button variant="text" size="default">
              Dashboard
            </Button>
          </Link>
        </div>
        <div className="mt-3 flex gap-2">
          <Link href="/tests/components" className="flex-1">
            <Button 
              variant={pathname === '/tests/components' ? 'filled' : 'outlined'}
              className="w-full"
            >
              Components
            </Button>
          </Link>
          <Link href="/tests/forms" className="flex-1">
            <Button 
              variant={pathname === '/tests/forms' ? 'filled' : 'outlined'}
              className="w-full"
            >
              Forms
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full pt-32 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
