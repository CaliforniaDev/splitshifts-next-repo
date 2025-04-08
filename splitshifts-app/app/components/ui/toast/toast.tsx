'use client';

import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
  ref,
  className,
  ...props
}: {
  ref?: React.Ref<HTMLElement>;
} & React.ComponentProps<typeof ToastPrimitives.Viewport>) => {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        className,
      )}
      {...props}
    />
  );
};
ToastViewport.displayName = 'ToastViewport';

// styles/hover-overlay.ts
export const hoverOverlay =
  'relative overflow-hidden before:absolute before:inset-0 before:bg-inverse-primary before:opacity-0 before:pointer-events-none before:transition-opacity hover:before:opacity-8';

const toastVariants = cva(
  `${hoverOverlay} group pointer-events-auto relative flex w-full items-center justify-between gap-2 rounded-[4px] transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:sm:slide-in-from-bottom-full`,
  {
    variants: {
      variant: {
        default: 'relative bg-inverse-surface h-[48px] pl-4 shadow-elevation-3',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Toast = ({
  ref,
  className,
  variant,
  ...props
}: {
  ref?: React.Ref<HTMLElement>;
  variant?: VariantProps<typeof toastVariants>['variant'];
} & React.ComponentProps<typeof ToastPrimitives.Root>) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
);
Toast.displayName = 'Toast';

const ToastAction = ({
  ref,
  className,
  ...props
}: {
  ref?: React.Ref<HTMLElement>;
} & React.ComponentProps<typeof ToastPrimitives.Action>) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
);
ToastAction.displayName = 'ToastAction';

const ToastClose = ({
  ref,
  className,
  ...props
}: {
  ref?: React.Ref<HTMLElement>;
} & React.ComponentProps<typeof ToastPrimitives.Close>) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'flex h-12 w-12 items-center justify-center rounded-md text-inverse-on-surface opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=''
    {...props}
  >
    <X className='h-6 w-6' />
  </ToastPrimitives.Close>
);
ToastClose.displayName = 'ToastClose';



const ToastDescription = ({
  ref,
  className,
  ...props
}: {
  ref?: React.Ref<HTMLElement>;
} & React.ComponentProps<typeof ToastPrimitives.Description>) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('typescale-body-medium text-inverse-on-surface', className)}
    {...props}
  />
);
ToastDescription.displayName = 'ToastDescription';

type ToastProps = React.ComponentProps<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastDescription,
  ToastClose,
  ToastAction,
};
