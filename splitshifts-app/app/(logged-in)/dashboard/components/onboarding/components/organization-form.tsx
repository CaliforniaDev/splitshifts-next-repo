'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from '@/app/lib/validation/organization';
import { createOrganization } from '../../../actions/organization/create-organization';
import { editOrganization } from '../../../actions/organization/edit-organization';
import { hardDeleteOrganization } from '../../../actions/organization/hard-delete-organization';
import { getUserOrganization } from '../../../actions/organization/get-user-organization';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

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
  FormMessage,
} from '@/app/components/ui/form';

import { Input, Textarea } from '@/app/components/ui/inputs';
import Button from '@/app/components/ui/buttons/button';
import { Skeleton } from '@/app/components/ui/skeleton';

interface OrganizationFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

function OrganizationFormSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-14 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-24 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-12 w-full' />
      </div>
      <div className='space-y-2 pt-4'>
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-11 w-full' />
      </div>
    </div>
  );
}

export default function OrganizationForm({
  onSuccess,
  onBack,
}: OrganizationFormProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession();
  const [existingOrgId, setExistingOrgId] = useState<string | null>(null);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      description: '',
      weekStartDay: 'monday',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // Load existing organization if it exists
  useEffect(() => {
    const loadOrganization = async () => {
      setIsLoadingOrg(true);
      const response = await getUserOrganization();

      if (response.success && response.organization) {
        // Organization exists, pre-populate form
        setExistingOrgId(response.organization.id);
        form.reset({
          name: response.organization.name,
          description: response.organization.description || '',
          weekStartDay: response.organization.weekStartDay,
        });
      }
      setIsLoadingOrg(false);
    };

    loadOrganization();
  }, [form]);

  useEffect(() => {
    if (!isLoadingOrg) {
      const timer = requestAnimationFrame(() => {
        nameInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isLoadingOrg]);

  const handleSubmit = async (data: CreateOrganizationFormData) => {
    try {
      let response;

      // Update existing organization
      if (existingOrgId) {
        response = await editOrganization({
          id: existingOrgId,
          ...data,
        });

        if (response.success) {
          onSuccess();
          return;
        }

        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to update organization',
        });
        return;
      }

      // Create new organization
      response = await createOrganization(data);

      if (!response.success) {
        form.setError('root', {
          type: 'server',
          message: response.error || 'Failed to create organization',
        });
        return;
      }

      // Update session with new orgId
      if (response.organizationId) {
        await update({ orgId: response.organizationId });
        setExistingOrgId(response.organizationId);
      }

      onSuccess();
    } catch {
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred',
      });
    }
  };

  const handleCancel = async () => {
    // No organization created yet, just go back
    if (!existingOrgId) {
      onBack();
      return;
    }

    // Organization exists, show confirmation dialog
    setShowCancelDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!existingOrgId) return;
    
    setIsDeleting(true);
    
    // Use HARD DELETE during onboarding - organization is incomplete
    // User expects "cancel" to fully undo the setup, not just hide it
    const response = await hardDeleteOrganization({ id: existingOrgId });
    
    if (!response.success) {
      alert(response.error || 'Failed to delete organization');
      setIsDeleting(false);
      return;
    }
    
    await update({ orgId: null }); // Clear orgId from session
    setShowCancelDialog(false);
    setIsDeleting(false);
    onBack(); // Return to welcome
  };

  return (
    <>
      <Card className='mx-auto w-full max-w-md border-none shadow-elevation-0'>
        <CardHeader>
          <CardTitle>
            {existingOrgId
              ? 'Update Your Organization'
              : 'Create Your Organization'}
          </CardTitle>
          <CardDescription>
            {existingOrgId
              ? 'Update the details of your organization.'
              : 'Start by providing some basic details about your organization.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingOrg ? (
            <OrganizationFormSkeleton />
          ) : (
            <>
              {form.formState.errors.root && (
                <div className='mb-4'>
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <fieldset disabled={isSubmitting} className='space-y-4'>
                    <FormField
                      name='name'
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              ref={nameInputRef}
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
                            <Textarea
                              {...field}
                              label='Description (Optional)'
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
                              <label className='typescale-body-medium block text-on-surface'>
                                Week Starts On
                              </label>
                              <select
                                {...field}
                                className={`w-full rounded-lg border p-3 text-on-surface ${
                                  fieldState.error
                                    ? 'border-error bg-error-container/10'
                                    : 'border-outline bg-surface'
                                }`}
                              >
                                <option value='monday'>Monday</option>
                                <option value='sunday'>Sunday</option>
                              </select>
                              {fieldState.error && (
                                <FormMessage>
                                  {fieldState.error.message}
                                </FormMessage>
                              )}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className='flex flex-col space-y-4 pt-4'>
                      <Button
                        type='submit'
                        variant='filled'
                        className='w-full'
                        loading={isSubmitting}
                        loadingText={
                          existingOrgId ? 'Updating...' : 'Creating...'
                        }
                      >
                        {existingOrgId
                          ? 'Update Organization'
                          : 'Create Organization'}
                      </Button>
                      <Button
                        type='button'
                        variant='outlined'
                        className='w-full'
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </fieldset>
                </form>
              </Form>
            </>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization?</DialogTitle>
            <DialogDescription>
              You have already created an organization. Clicking Delete will
              permanently remove it and return you to the welcome screen. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='text'
              onClick={() => setShowCancelDialog(false)}
              disabled={isDeleting}
            >
              Keep Organization
            </Button>
            <Button
              variant='filled'
              onClick={handleConfirmDelete}
              loading={isDeleting}
              loadingText='Deleting...'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
