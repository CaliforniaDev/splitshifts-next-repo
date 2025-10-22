'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  updateOrganizationSchema,
  type UpdateOrganizationFormData,
} from '@/app/lib/validation';

import {
  editOrganization,
  deleteOrganization,
} from '@/app/(logged-in)/dashboard/actions';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/inputs';
import { Button } from '@/app/components/ui/buttons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: {
    id: string;
    name: string;
    description?: string | null;
    weekStartDay: string;
  };
}

/**
 * Organization management modal for editing and deleting organizations
 *
 * Features:
 * - Edit organization details (name, description, week start day)
 * - Soft delete organization with confirmation
 * - Form validation with React Hook Form and Zod
 * - Loading states for both update and delete operations
 * - Error handling with user-friendly messages
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal should close
 * @param organization - Current organization data to pre-populate form
 */
export default function OrganizationManagementModal({
  isOpen,
  onClose,
  organization,
}: ModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateOrganizationFormData>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      id: organization.id,
      name: organization.name,
      description: organization.description || '',
      weekStartDay: organization.weekStartDay as 'monday' | 'sunday',
    },
  });
  const isSubmitting = form.formState.isSubmitting;

  const handleUpdate = async (data: UpdateOrganizationFormData) => {
    try {
      const response = await editOrganization(data);

      if (response.success) {
        router.refresh();
        onClose();
      } else {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to update organization',
        });
      }
    } catch (error) {
      console.error('Unexpected error updating organization:', error);
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete "${organization.name}"?\n\n` +
        'This will remove the organization and all associated data. ' +
        'You will need to create a new organization or join an existing one.\n\n' +
        'This action cannot be undone.',
    );
    if (!confirm) return;

    setIsDeleting(true);
    try {
      const response = await deleteOrganization({ id: organization.id });
      if (response.success) {
        router.refresh();
      } else {
        alert(response.error || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Unexpected error deleting organization:', error);
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred. Please try again',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Organization</DialogTitle>
          <DialogDescription>
            Update your organization details or delete it entirely.
          </DialogDescription>
        </DialogHeader>
        {/* Display form-level errors */}
        {form.formState.errors.root && (
          <div className='bg-destructive/10 mb-4 rounded-md p-3'>
            <FormMessage className='text-destructive'>
              {form.formState.errors.root.message}
            </FormMessage>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className='space-y-4'
          >
            <fieldset
              disabled={isSubmitting || isDeleting}
              className='space-y-4'
            >
              <FormField
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Organization Name *'
                        type='text'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label='Description (Optional)'
                        type='text'
                        onBlur={field.onBlur}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name='weekStartDay'
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <div className='space-y-2'>
                        <label className='typescale-body-small text-on-surface'>
                          Week Start Day *
                        </label>
                        <select
                          {...field}
                          className='w-full rounded-md border border-outline bg-surface-container px-3 py-2 text-on-surface focus:border-primary focus:outline-none'
                        >
                          <option value='monday'>Monday</option>
                          <option value='sunday'>Sunday</option>
                        </select>
                        {fieldState.error && (
                          <FormMessage>{fieldState.error.message}</FormMessage>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </fieldset>
          </form>
        </Form>

        <DialogFooter className='gap-4 pt-4'>
          <DialogClose asChild>
            <Button variant='text' disabled={isSubmitting || isDeleting}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={form.handleSubmit(handleUpdate)}
            variant='filled'
            loading={isSubmitting}
            loadingText='Updating...'
            disabled={isDeleting}
            className='flex-1'
          >
            Update Organization
          </Button>
          <Button
            type='button'
            variant='destructive'
            loading={isDeleting}
            loadingText='Deleting...'
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
