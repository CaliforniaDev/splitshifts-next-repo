'use client';

import { useState } from 'react';
import DatePicker from '@/app/components/ui/inputs/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function TestDatePickerPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [constrainedDate, setConstrainedDate] = useState<Date | null>(null);

  const minDate = new Date(2026, 0, 1);
  const maxDate = new Date(2026, 11, 31);
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
              error={isEndBeforeStart}
              errorMessage='End date cannot be before start date.'
            />
          </div>

          <div>
            <DatePicker
              label='Constrained Date'
              value={constrainedDate}
              onChange={setConstrainedDate}
              supportingText='Allowed window: Jan 1, 2026 - Dec 31, 2026 (weekdays only)'
              minDate={minDate}
              maxDate={maxDate}
              isDateDisabled={isWeekend}
              outOfRangeDateMessage='Pick a weekday in 2026.'
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
