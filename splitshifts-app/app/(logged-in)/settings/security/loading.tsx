import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Security Settings Page Loading State
 */
export default function SecuritySettingsLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="bg-surface-container rounded-xl p-6 space-y-4">
        <Skeleton className="h-6 w-64" />
        
        {/* 2FA Toggle Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
