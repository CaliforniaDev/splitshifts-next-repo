import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Calendar Page Loading State
 */
export default function CalendarLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-96" />
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Calendar Grid */}
      <Skeleton className="h-[500px] w-full rounded-xl" />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </section>
  );
}
