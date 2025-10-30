import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Account Settings Page Loading State
 */
export default function AccountSettingsLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      {/* Profile Information Card */}
      <div className="bg-surface-container rounded-xl p-6 space-y-6">
        <Skeleton className="h-6 w-48" />
        
        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-14 w-full" />
          </div>
          
          {/* Action Button */}
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </section>
  );
}
