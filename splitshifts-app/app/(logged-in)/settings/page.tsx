// File: app/(logged-in)/settings/page.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { DashboardIcon } from '@/app/components/ui/icons/dashboard/dashboard-icon-picker';
import { settingsNavigation } from '@/app/components/ui/nav/settings/settings-nav-config';

export default function SettingsPage() {
  const pathname = usePathname();

  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Settings</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Settings Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsNavigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group relative overflow-hidden rounded-xl border p-6 transition-all duration-200
                ${isActive 
                  ? 'border-primary bg-primary-container text-on-primary-container' 
                  : 'border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-outline'
                }
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary
              `}
            >
              {/* Icon */}
              <div className="mb-4">
                <DashboardIcon
                  name={item.icon}
                  variant={isActive ? 'solid' : 'outline'}
                  className="h-8 w-8 text-current"
                />
              </div>
              
              {/* Content */}
              <div>
                <h3 className="font-semibold text-current mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-sm opacity-75">{item.description}</p>
                )}
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
