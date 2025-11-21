'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createShiftSchema, type CreateShiftFormData } from '@/app/lib/validation/shift';
import { createShift } from '../../actions/shift';

import {
  Dialog,
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
} from '@/app/components/ui/form';
import { Input, SelectMenu, Textarea } from '@/app/components/ui/inputs';
import { Button } from '@/app/components/ui/buttons';

interface ShiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  worksites: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; title: string }>;
  defaultDate?: Date;
}

/**
 * Shift creation modal component
 * 
 * Features:
 * - Create new shifts with worksite and role assignment
 * - Native datetime-local inputs for start/end times
 * - Optional hourly rate and notes
 * - Form validation with React Hook Form and Zod
 * - Auto-refresh calendar on success
 * 
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal should close
 * @param worksites - Available worksites for selection
 * @param roles - Available roles for selection
 * @param defaultDate - Optional default date for the shift
 */
export default function ShiftFormModal({
  isOpen,
  onClose,
  worksites,
  roles,
  defaultDate,
}: ShiftFormModalProps) {
  const router = useRouter();

  // Format default date for datetime-local input (YYYY-MM-DDTHH:MM)
  const getDefaultDateTime = (hoursOffset = 0) => {
    const date = defaultDate || new Date();
    date.setHours(9 + hoursOffset, 0, 0, 0); // Default to 9 AM start, 5 PM end
    return date.toISOString().slice(0, 16);
  };

  const form = useForm<CreateShiftFormData>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      workSiteId: '',
      roleId: '',
      shiftStart: getDefaultDateTime(0),
      shiftEnd: getDefaultDateTime(8),
      hourlyRate: '',
      notes: '',
      status: 'draft',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (data: CreateShiftFormData) => {
    try {
      const response = await createShift(data);

      if (response.success) {
        router.refresh();
        form.reset();
        onClose();
      } else {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to create shift',
        });
      }
    } catch (error) {
      console.error('Unexpected error creating shift:', error);
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Don't render form until dialog is open (fixes context issue)
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Shift</DialogTitle>
          <DialogDescription>
            Schedule a new shift by selecting the location, role, and time.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <fieldset disabled={isSubmitting} className="space-y-6">
              {/* Error Display */}
              {form.formState.errors.root && (
                <div className="rounded-lg bg-error-container p-4 text-sm text-on-error-container">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Worksite Selection */}
              <FormField
                name="workSiteId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <SelectMenu
                        {...field}
                        label="Location *"
                        options={worksites.map(ws => ({
                          label: ws.name,
                          value: ws.id,
                        }))}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Role Selection */}
              <FormField
                name="roleId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <SelectMenu
                        {...field}
                        label="Role *"
                        options={roles.map(role => ({
                          label: role.title,
                          value: role.id,
                        }))}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shift Start */}
              <FormField
                name="shiftStart"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label="Start Date & Time *"
                        type="datetime-local"
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Shift End */}
              <FormField
                name="shiftEnd"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label="End Date & Time *"
                        type="datetime-local"
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Hourly Rate (Optional) */}
              <FormField
                name="hourlyRate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label="Hourly Rate (Optional)"
                        type="text"
                        placeholder="25.00"
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Notes (Optional) */}
              <FormField
                name="notes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        label="Notes (Optional)"
                        placeholder="Any special instructions or requirements..."
                        rows={3}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Status Selection */}
              <FormField
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <SelectMenu
                        {...field}
                        label="Status *"
                        options={[
                          { label: 'Draft', value: 'draft' },
                          { label: 'Published', value: 'published' },
                        ]}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </fieldset>

            <DialogFooter>
              <Button
                type="button"
                variant="text"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="filled"
                loading={isSubmitting}
                loadingText="Creating..."
              >
                Create Shift
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
