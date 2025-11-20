// File: app/(logged-in)/dashboard/calendar/page.tsx

import { validateUserSession } from '@/app/lib/auth-utils';
import { getShifts } from '../actions/shift';
import CalendarWeekView from './components/calendar-week-view';
import Button from '@/app/components/ui/buttons/button';

export default async function CalendarPage() {
  await validateUserSession();

  // Get current week's date range
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  // Fetch shifts for the current week
  const result = await getShifts({
    startDate: startOfWeek.toISOString(),
    endDate: endOfWeek.toISOString(),
  });

  const shifts = result.success ? result.shifts : [];

  return (
    <section className='space-y-6 p-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-semibold text-on-surface'>Calendar</h1>
        <p className='mt-2 text-sm text-on-surface-variant'>
          View and manage your schedule across all locations and employees.
        </p>
      </div>

      {/* Calendar Controls */}
      <div className='flex items-center justify-between'>
        <div className='flex gap-2'>
          <Button variant='filled' size='small'>
            Week
          </Button>
          <Button variant='outlined' size='small'>
            Month
          </Button>
        </div>

        <div className='flex gap-2'>
          <Button variant='filled' size='small'>
            Add Shift
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <CalendarWeekView shifts={shifts} currentDate={now} />

      {/* Quick Actions */}
      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-xl bg-surface-container p-4'>
          <h3 className='mb-2 font-medium text-on-surface'>
            Schedule Template
          </h3>
          <p className='mb-3 text-sm text-on-surface-variant'>
            Create recurring shift patterns
          </p>
          <button className='text-sm text-primary hover:underline'>
            Create Template
          </button>
        </div>

        <div className='rounded-xl bg-surface-container p-4'>
          <h3 className='mb-2 font-medium text-on-surface'>Bulk Actions</h3>
          <p className='mb-3 text-sm text-on-surface-variant'>
            Assign multiple shifts at once
          </p>
          <button className='text-sm text-primary hover:underline'>
            Bulk Assign
          </button>
        </div>

        <div className='rounded-xl bg-surface-container p-4'>
          <h3 className='mb-2 font-medium text-on-surface'>Export Schedule</h3>
          <p className='mb-3 text-sm text-on-surface-variant'>
            Download schedule as PDF or CSV
          </p>
          <button className='text-sm text-primary hover:underline'>
            Export
          </button>
        </div>
      </div>
    </section>
  );
}
