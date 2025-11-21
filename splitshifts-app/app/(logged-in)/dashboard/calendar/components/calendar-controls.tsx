'use client';

import { useState } from 'react';
import Button from '@/app/components/ui/buttons/button';
import ShiftFormModal from './shift-form-modal';

interface CalendarControlsProps {
  worksites: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; title: string }>;
  currentDate: Date;
}

/**
 * Client component for calendar controls with modal state management
 * 
 * Handles the Add Shift button click and modal open/close state.
 * This component bridges server-fetched data with client-side interactions.
 */
export default function CalendarControls({ worksites, roles, currentDate }: CalendarControlsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
          <Button 
            variant='filled' 
            size='small'
            onClick={() => setIsModalOpen(true)}
          >
            Add Shift
          </Button>
        </div>
      </div>

      <ShiftFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        worksites={worksites}
        roles={roles}
        defaultDate={currentDate}
      />
    </>
  );
}
