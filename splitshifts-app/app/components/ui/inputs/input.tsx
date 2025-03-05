'use client'; //

import { useId, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

// Input field styles
const inputVariants = cva(
  'relative h-14 w-full rounded-t-[4px] bg-surface-container-highest px-4 pb-2 pt-6 text-on-surface transition-textfield duration-200 ease-in focus:outline-none',
  {
    variants: {
      focused: {
        true: 'border-b-2 border-b-primary caret-primary',
        false: 'border-b-[1px] border-b-on-surface',
      },
      error: {
        true: 'border-b-error caret-error',
        false: null,
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      focused: false,
      error: false,
      disabled: false,
    },
  },
);
// Label styles
const labelVariants = cva(
  'pointer-events-none absolute left-4 right-4 text-left transition-all duration-300 ease-in-out',
  {
    variants: {
      floating: {
        true: 'typescale-body-small pt-[8px] text-primary',
        false: 'typescale-body-large pt-4',
      },
      error: {
        true: 'text-error',
        false: null,
      },
    },
    compoundVariants: [
      {
        floating: false,
        className: 'typescale-body-large pt-4',
      },
    ],
  },
);
// Hover State Overlay
const hoverOverlay = cva(
  'hover-overlay pointer-events-none absolute inset-0 rounded-t-[4px] opacity-0 transition-all duration-300 ease-in-out',
  {
    variants: {
      focused: {
        true: null,
        false: 'group-hover:bg-on-surface group-hover:opacity-8',
      },
    },
  },
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'disabled'>,
    VariantProps<typeof inputVariants> {
  label: string;
  error?: boolean | null;
  errorMessage?: string;
  supportingText?: string;
  ref?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
}

export default function Input({
  id,
  label,
  value,
  defaultValue,
  error,
  errorMessage,
  supportingText,
  disabled,
  onChange,
  className,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue || '',
  );

  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : uncontrolledValue;
  const hasValue = !!inputValue?.length;
  const generatedId = useId();
  const inputId = id || generatedId;

  // Accessibility IDs
  const errorId = `${inputId}-error`;
  const supportingTextId = `${inputId}-supporting-text`;
  const describedByIds: string[] = [];
  if (error) describedByIds.push(errorId);
  if (supportingText && !error) describedByIds.push(supportingTextId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Updates local state only for uncontrolled input
    if (!isControlled) setUncontrolledValue(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (focus: boolean) => setIsFocused(focus);

  return (
    <div className='group relative'>
      <span className='relative block w-full'>
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            inputVariants({
              focused: isFocused,
              error: !!error,
              disabled: !!disabled,
            }),
            className,
          )}
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
          value={isControlled ? value : undefined}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
        />
        <div
          aria-hidden='true'
          className={hoverOverlay({ focused: isFocused })}
        ></div>
        <label
          htmlFor={inputId}
          className={labelVariants({
            floating: !!isFocused || hasValue,
            error: !!error,
          })}
        >
          {label}
        </label>
      </span>

      {/* Supporting Text OR Error Message (Show Only One) */}
      {error ? (
        <p
          id={errorId}
          aria-live='assertive'
          className='typescale-body-small px-4 pb-0 pt-1 text-error'
        >
          {errorMessage ?? 'There is an error'}
        </p>
      ) : supportingText ? (
        <p
          id={supportingTextId}
          aria-live='polite'
          className='typescale-body-small px-4 pb-0 pt-1'
        >
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}
