import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Change Password Page Loading State
 */
export default function ChangePasswordLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto">
        <div className="bg-surface-container rounded-xl p-6 space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-14 w-full" />
          </div>
          
          {/* New Password */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-14 w-full" />
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-14 w-full" />
          </div>
          
          {/* Submit Button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
