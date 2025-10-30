import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Settings Main Page Loading State
 */
export default function SettingsLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      {/* Settings Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-outline-variant bg-surface-container p-6 space-y-4">
            {/* Icon */}
            <Skeleton className="h-8 w-8" />
            
            {/* Content */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
