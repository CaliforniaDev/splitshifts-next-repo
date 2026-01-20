'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/buttons';
import ShiftFormModal from './shift-form-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

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

  // Check if prerequisites are met for creating shifts
  const hasWorksites = worksites.length > 0;
  const hasRoles = roles.length > 0;
  const canCreateShift = hasWorksites && hasRoles;

  // Generate helpful tooltip message when prerequisites are missing
  const getDisabledTooltip = () => {
    if (!hasWorksites && !hasRoles) return 'Add worksites and roles to create shifts';
    if (!hasWorksites) return 'Add at least one worksite to create shifts';
    if (!hasRoles) return 'Add at least one role to create shifts';
    return '';
  };

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button 
                    variant='filled' 
                    size='small'
                    onClick={() => setIsModalOpen(true)}
                    disabled={!canCreateShift}
                  >
                    Add Shift
                  </Button>
                </span>
              </TooltipTrigger>
              {!canCreateShift && (
                <TooltipContent>
                  <p>{getDisabledTooltip()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
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
