import { Skeleton } from '@/app/components/ui/skeleton';

/**
 * Employees Page Loading State
 */
export default function EmployeesLoading() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <Skeleton className="flex-1 h-10" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Employee Table */}
      <div className="bg-surface-container rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 bg-surface-container-high border-b border-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 hidden md:block" />
            <Skeleton className="h-4 w-16 hidden md:block" />
            <Skeleton className="h-4 w-20 hidden md:block" />
          </div>
        </div>

        {/* Employee Rows */}
        <div className="divide-y divide-outline-variant">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24 hidden md:block" />
                <Skeleton className="h-6 w-16 rounded-full hidden md:block" />
                <Skeleton className="h-8 w-20 hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
