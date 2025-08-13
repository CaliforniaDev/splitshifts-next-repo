// File: app/(logged-in)/dashboard/calendar/page.tsx

'use client';

export default function CalendarPage() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Calendar</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          View and manage your schedule across all locations and employees.
        </p>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors">
            Today
          </button>
          <button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-sm font-medium transition-colors">
            Week
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium">
            Month
          </button>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium">
            Add Shift
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-surface-container rounded-xl p-6 min-h-[500px]">
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-on-surface mb-2">Calendar Coming Soon</h3>
          <p className="text-on-surface-variant">
            Interactive schedule calendar with drag-and-drop shift management will be available here.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Schedule Template</h3>
          <p className="text-sm text-on-surface-variant mb-3">
            Create recurring shift patterns
          </p>
          <button className="text-sm text-primary hover:underline">
            Create Template
          </button>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Bulk Actions</h3>
          <p className="text-sm text-on-surface-variant mb-3">
            Assign multiple shifts at once
          </p>
          <button className="text-sm text-primary hover:underline">
            Bulk Assign
          </button>
        </div>
        
        <div className="bg-surface-container rounded-xl p-4">
          <h3 className="font-medium text-on-surface mb-2">Export Schedule</h3>
          <p className="text-sm text-on-surface-variant mb-3">
            Download schedule as PDF or CSV
          </p>
          <button className="text-sm text-primary hover:underline">
            Export
          </button>
        </div>
      </div>
    </section>
  );
}
