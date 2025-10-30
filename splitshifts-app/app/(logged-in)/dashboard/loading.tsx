import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Dashboard Loading State
 * 
 * Displays while navigating between dashboard pages
 */
export default function DashboardLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      {/* Content Skeleton */}
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </section>
  );
}
