'use client'; //

import { useId, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

// Input field styles
const inputVariants = cva(
  'relative h-14 w-full rounded-t-[4px] bg-surface-container-highest px-4 pb-2 pt-6 text-on-surface transition-textfield duration-200 ease-in focus:outline-none',
  {
    variants: {
      focused: {
        true: 'border-b-2 border-primary caret-primary',
        false:
          'border-b-[1px] border-on-surface-variant group-hover:border-on-surface',
      },
      error: {
        true: 'border-error caret-error group-hover:border-on-error-container',
        false: null,
      },
      disabled: {
        true: 'bg-on-surface opacity-[0.04] cursor-not-allowed',
        false: ' bg-surface-container-highest cursor-text',
      },
    },
    compoundVariants: [
      {
        error: true,
        focused: true,
        className: 'border-b-error caret-error group-hover:border-error',
      },
    ],
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
        true: 'typescale-body-small pt-[8px]',
        false: 'typescale-body-large pt-4',
      },
      focused: {
        true: 'typescale-body-small pt-[8px]',
        false: 'null',
      },
      error: {
        true: 'text-error',
        false: null,
      },
      disabled: {
        true: 'opacity-[0.38]',
        false: null,
      },
    },
    compoundVariants: [
      {
        error: false,
        focused: false,
        floating: false,
        className: 'text-on-surface-variant group-hover:text-on-surface',
      },
      {
        error: false,
        focused: false,
        floating: true,
        className: 'text-on-surface-variant group-hover:text-on-surface',
      },
      {
        error: false,
        focused: true,
        className: 'text-primary',
      },
      {
        focused: false,
        error: true,
        className: 'group-hover:text-on-error-container',
      },
    ],
    defaultVariants: {
      error: false,
      floating: false,
      disabled: false,
      focused: false,
    },
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

/**
 * Input component for SplitShifts
 * - Accessible, supports controlled/uncontrolled usage
 * - Shows error or supporting text
 * - Uses Tailwind and CVA for styling
 * @param props InputProps
 */
export default function Input({
  id,
  label,
  value,
  defaultValue,
  error = false,
  errorMessage = '',
  supportingText = '',
  disabled = false,
  onChange,
  className = '',
  onBlur,
  "data-testid": dataTestId = 'input',
  required = false,
  ...props
}: InputProps & { "data-testid"?: string; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const uncontrolledValueRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : uncontrolledValueRef.current?.value;
  const hasValue = Boolean(inputValue?.length);
  const generatedId = useId();
  const inputId = id || generatedId;

  // Accessibility IDs
  const errorId = `${inputId}-error`;
  const supportingTextId = `${inputId}-supporting-text`;
  const describedBy = error
    ? errorId
    : supportingText
      ? supportingTextId
      : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled && uncontrolledValueRef.current) {
      uncontrolledValueRef.current.value = e.target.value;
    }
    onChange?.(e);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  return (
    <div className='group relative' data-testid={dataTestId}>
      <span className='relative block w-full'>
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          className={cn(
            inputVariants({
              focused: isFocused,
              error: !!error,
              disabled: !!disabled,
            }),
            className,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={isControlled ? value : undefined}
          defaultValue={defaultValue}
          ref={uncontrolledValueRef}
          onChange={handleChange}
          {...props}
        />
        {!disabled && (
          <div
            aria-hidden='true'
            className={hoverOverlay({ focused: !!isFocused })}
          ></div>
        )}
        <label
          htmlFor={inputId}
          className={labelVariants({
            floating: !!isFocused || hasValue,
            error: !!error && !disabled,
            focused: !!isFocused,
            disabled: !!disabled,
          })}
        >
          {label}
        </label>
      </span>

      {/* Supporting Text OR Error Message (Show Only One) */}
      {error && !disabled && errorMessage ? (
        <p
          id={errorId}
          aria-live='assertive'
          className='typescale-body-small px-4 pb-0 pt-1 text-error'
        >
          {errorMessage ?? 'An error occurred.'}
        </p>
      ) : supportingText && !disabled ? (
        <p
          id={supportingTextId}
          aria-live='polite'
          className='typescale-body-small px-4 pb-0 pt-1 text-on-surface-variant'
        >
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}
