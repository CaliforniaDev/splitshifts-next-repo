'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastViewport,
  useToast,
} from '@/app/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className='group relative'>
            <div className='flex w-full items-center justify-between'>
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
              {action}
              <ToastClose />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}