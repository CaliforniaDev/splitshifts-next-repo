'use client';

/**
 * Input & Textarea Components
 * 
 * Architecture based on MUI's FilledInput implementation:
 * - Label positioned outside the input container (prevents scroll underlap)
 * - Three-layer border system: base border (::before), animated underline (::after), hover overlay
 * - Container handles padding and visual styling, input elements remain minimal
 * - Material Design Standard easing curves and 200ms duration for all animations
 */

import { useId, useRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

// Input/Textarea field styles
const inputVariants = cva(
  'relative w-full rounded-t-[4px] bg-surface-container-highest px-4 pb-2 text-on-surface focus:outline-none transition-colors duration-200 ease-emphasized',
  {
    variants: {
      multiline: {
        true: 'min-h-[56px] resize-none align-top pt-[25px]',
        false: 'h-14 pt-6',
      },
      disabled: {
        true: 'bg-on-surface opacity-[0.04] cursor-not-allowed',
        false: 'bg-surface-container-highest cursor-text',
      },
    },
    defaultVariants: {
      multiline: false,
      disabled: false,
    },
  },
);

// Animated 2px underline that expands from center on focus (Material Design ::after)
const animatedUnderline = cva(
  'absolute bottom-0 left-0 right-0 h-[2px] origin-center transition-transform duration-200 ease-out',
  {
    variants: {
      focused: {
        true: 'scale-x-100',
        false: 'scale-x-0',
      },
      error: {
        true: 'bg-error',
        false: 'bg-primary',
      },
    },
    defaultVariants: {
      focused: false,
      error: false,
    },
  },
);

// Base 1px border with color transitions (Material Design ::before)
const baseBorder = cva(
  'absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none transition-colors duration-200 ease-in-out',
  {
    variants: {
      error: {
        true: 'bg-error',
        false: 'bg-on-surface-variant group-hover:bg-on-surface',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

// Floating label styles
const labelVariants = cva(
  'pointer-events-none absolute left-4 right-4 text-left z-10',
  {
    variants: {
      floating: {
        true: 'typescale-body-small pt-[8px] transition-all duration-200 ease-in-out',
        false: 'typescale-body-large pt-4 transition-all duration-200 ease-in-out',
      },
      focused: {
        true: 'typescale-body-small pt-[8px]',
        false: null,
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

// Hover state overlay (8% opacity on hover)
const hoverOverlay = cva(
  'pointer-events-none absolute inset-0 rounded-t-[4px] opacity-0 transition-opacity duration-200 ease-emphasized',
  {
    variants: {
      focused: {
        true: null,
        false: 'group-hover:bg-on-surface group-hover:opacity-8',
      },
    },
    defaultVariants: {
      focused: false,
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
  // Primary/required props
  id,
  label,
  value,
  defaultValue,

  // Error and supporting text
  error = false,
  errorMessage = '',
  supportingText = '',

  // Accessibility and state
  disabled = false,
  required = false,
  className = '',
  "data-testid": dataTestId = 'input',

  // Callbacks
  onChange,
  onBlur,

  // Rest props
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
      {/* Label outside the container (MUI approach) */}
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
      {/* Container with input */}
      <div className='relative block w-full'>
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          className={cn(
            inputVariants({
              multiline: false,
              disabled: !!disabled,
            }),
            error ? 'caret-error' : 'caret-primary',
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
        {/* Base border (::before) - 1px with color transitions */}
        {!disabled && (
          <div
            aria-hidden='true'
            className={baseBorder({ error: !!error })}
          />
        )}
        {/* Animated underline (::after) that expands from center */}
        {!disabled && (
          <div
            aria-hidden='true'
            className={animatedUnderline({
              focused: isFocused,
              error: !!error,
            })}
          />
        )}
        {!disabled && (
          <div
            aria-hidden='true'
            className={hoverOverlay({ focused: !!isFocused })}
          ></div>
        )}
      </div>

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

interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled'>,
    VariantProps<typeof inputVariants> {
  label: string;
  error?: boolean | null;
  errorMessage?: string;
  supportingText?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
  disabled?: boolean;
  defaultValue?: string;
  value?: string;
  rows?: number;
}

/**
 * Textarea component for SplitShifts
 * - Accessible, supports controlled/uncontrolled usage
 * - Shows error or supporting text
 * - Uses Tailwind and CVA for styling
 * - Shares the same visual style as Input component
 * @param props TextareaProps
 */
export function Textarea({
  // Primary/required props
  id,
  label,
  value,
  defaultValue,
  rows = 4,

  // Error and supporting text
  error = false,
  errorMessage = '',
  supportingText = '',

  // Accessibility and state
  disabled = false,
  required = false,
  className = '',
  "data-testid": dataTestId = 'textarea',

  // Callbacks
  onChange,
  onBlur,

  // Rest props
  ...props
}: TextareaProps & { "data-testid"?: string; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);
  const uncontrolledValueRef = useRef<HTMLTextAreaElement>(null);

  const isControlled = value !== undefined;
  const textareaValue = isControlled ? value : uncontrolledValueRef.current?.value;
  const hasValue = Boolean(textareaValue?.length);
  const generatedId = useId();
  const textareaId = id || generatedId;

  // Accessibility IDs
  const errorId = `${textareaId}-error`;
  const supportingTextId = `${textareaId}-supporting-text`;
  const describedBy = error
    ? errorId
    : supportingText
      ? supportingTextId
      : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled && uncontrolledValueRef.current) {
      uncontrolledValueRef.current.value = e.target.value;
    }
    onChange?.(e);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className='group relative' data-testid={dataTestId}>
      {/* Label outside the container (MUI approach) */}
      <label
        htmlFor={textareaId}
        className={labelVariants({
          floating: !!isFocused || hasValue,
          error: !!error && !disabled,
          focused: !!isFocused,
          disabled: !!disabled,
        })}
      >
        {label}
      </label>
      {/* Container with textarea - container provides padding */}
      <div className={cn(
        'relative block w-full rounded-t-[4px] bg-surface-container-highest',
        'px-4 pb-2 pt-[25px]', // Container padding for multiline
        disabled && 'bg-on-surface opacity-[0.04] cursor-not-allowed'
      )}>
        <textarea
          id={textareaId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          rows={rows}
          className={cn(
            'w-full bg-transparent text-on-surface resize-none border-none focus:outline-none p-0',
            error ? 'caret-error' : 'caret-primary',
            disabled && 'cursor-not-allowed',
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
        {/* Base border (::before) - 1px with color transitions */}
        {!disabled && (
          <div
            aria-hidden='true'
            className={baseBorder({ error: !!error })}
          />
        )}
        {/* Animated underline (::after) that expands from center */}
        {!disabled && (
          <div
            aria-hidden='true'
            className={animatedUnderline({
              focused: isFocused,
              error: !!error,
            })}
          />
        )}
        {!disabled && (
          <div
            aria-hidden='true'
            className={hoverOverlay({ focused: !!isFocused })}
          ></div>
        )}
      </div>

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
