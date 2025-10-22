'use client';

import { useState } from 'react';

import OrganizationManagementModal from './management-modal';
import { Button } from '@/app/components/ui/buttons';

interface ManagementClientProps {
  organization: {
    id: string;
    name: string;
    description?: string | null;
    weekStartDay: string;
  };
}

/**
 * Client component that manages organization modal state
 *
 * This component bridges the gap between server and client components:
 * - Receives organization data from server component (dashboard page)
 * - Manages modal open/close state (client-side only)
 * - Renders edit button and modal dialog
 *
 * @param organization - Current organization data passed from server
 */
export default function OrganizationManagementClient({
  organization,
}: ManagementClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className='mt-4 space-y-2'>
        <Button
          variant='filled'
          className='w-full'
          onClick={() => setIsModalOpen(true)}
        >
          Edit Organization
        </Button>
      </div>

      <OrganizationManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organization={organization}
      />
    </>
  );
}
