// File: app/(logged-in)/settings/layout.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const settingsPaths = {
  '/settings': 'Settings',
  '/settings/account': 'Account',
  '/settings/change-password': 'Change Password',
  '/settings/security': 'Security'
} as const;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSubPage = pathname !== '/settings';

  return (
    <div className="min-h-full bg-surface">
      {/* Breadcrumb Navigation */}
      {isSubPage && (
        <div className="border-b border-outline-variant bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              {/* Back to Settings */}
              <Link 
                href="/settings"
                className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Settings
              </Link>
              
              <ChevronRight className="w-4 h-4 text-outline" />
              
              {/* Current Page */}
              <span className="text-on-surface font-medium">
                {settingsPaths[pathname as keyof typeof settingsPaths]}
              </span>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
