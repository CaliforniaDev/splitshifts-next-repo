'use client';

import { useState } from 'react';
import DatePicker from '@/app/components/ui/inputs/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function TestDatePickerPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className='container mx-auto max-w-2xl p-8'>
      <Card className='w-full border-none shadow-elevation-0'>
        <CardHeader>
          <CardTitle>Date Picker Test Page</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <DatePicker
              label='Start Date'
              value={startDate}
              onChange={setStartDate}
              supportingText='Select a start date'
            />
          </div>

          <div>
            <DatePicker
              label='End Date'
              value={endDate}
              onChange={setEndDate}
              supportingText='Select an end date'
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
