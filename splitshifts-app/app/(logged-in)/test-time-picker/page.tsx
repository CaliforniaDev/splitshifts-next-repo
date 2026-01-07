'use client';

import { useState } from 'react';
import TimePicker from '@/app/components/ui/inputs/time-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function TestTimePickerPage() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card className="w-full border-none shadow-elevation-0">
        <CardHeader>
          <CardTitle>Time Picker Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              error={false}
              errorMessage=""
              supportingText="Select a start time"
            />
          </div>

          <div>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              error={false}
              errorMessage=""
              supportingText="Select an end time"
            />
          </div>

          <div className="mt-8 p-4 bg-surface-container-high rounded-lg">
            <h3 className="typescale-title-medium mb-2">Selected Values:</h3>
            <p className="typescale-body-medium">
              Start Time: {startTime ? startTime.toLocaleTimeString() : 'Not set'}
            </p>
            <p className="typescale-body-medium">
              End Time: {endTime ? endTime.toLocaleTimeString() : 'Not set'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
