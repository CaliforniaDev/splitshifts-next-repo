'use client';

import { useState } from 'react';
import DatePicker from '@/app/components/ui/inputs/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function TestDatePickerPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [constrainedDate, setConstrainedDate] = useState<Date | null>(null);

  const minDate = new Date(2026, 1, 10);
  const maxDate = new Date(2026, 1, 21);
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const isEndBeforeStart =
    startDate !== null &&
    endDate !== null &&
    endDate.getTime() < startDate.getTime();

  return (
    <div className='container mx-auto max-w-3xl p-8'>
      <Card className='w-full border-none shadow-elevation-0'>
        <CardHeader>
          <CardTitle>Date Picker Test Page</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='rounded-lg bg-surface-container-high p-4 typescale-body-medium text-on-surface'>
            <p>Quick checks:</p>
            <p>1. Type 8 digits (`MMDDYYYY`) and confirm slash auto-format + caret movement.</p>
            <p>2. Open calendar with icon, then test arrow keys, Home/End, PageUp/PageDown, and Enter.</p>
            <p>3. Type invalid dates (example: `03/48/1991`) and verify inline error messaging.</p>
            <p>4. Try selecting an end date before the start date (it should be blocked).</p>
            <p>5. For constrained date, only Feb 10-21, 2026 weekdays are allowed.</p>
          </div>

          <div>
            <DatePicker
              label='Start Date'
              value={startDate}
              onChange={setStartDate}
              supportingText='Type or select a start date'
            />
          </div>

          <div>
            <DatePicker
              label='End Date'
              value={endDate}
              onChange={setEndDate}
              supportingText='Must be same day or after start date'
              minDate={startDate ?? undefined}
              outOfRangeDateMessage='End date must be the same day or after start date.'
              error={isEndBeforeStart}
              errorMessage='End date cannot be before start date.'
            />
          </div>

          <div>
            <DatePicker
              label='Constrained Date'
              value={constrainedDate}
              onChange={setConstrainedDate}
              supportingText='Allowed window: Feb 10-21, 2026 (weekdays only)'
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isWeekend}
              outOfRangeDateMessage='Pick a weekday between Feb 10 and Feb 21, 2026.'
            />
          </div>

          <div className='mt-8 rounded-lg bg-surface-container-high p-4'>
            <h3 className='typescale-title-medium mb-2'>Selected Values:</h3>
            <p className='typescale-body-medium'>
              Start Date: {startDate ? startDate.toLocaleDateString() : 'Not set'}
            </p>
            <p className='typescale-body-medium'>
              End Date: {endDate ? endDate.toLocaleDateString() : 'Not set'}
            </p>
            <p className='typescale-body-medium'>
              Constrained Date:{' '}
              {constrainedDate ? constrainedDate.toLocaleDateString() : 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
