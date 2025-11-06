'use client';

/**
 * Select - Native select dropdown with floating labels and three-layer border system.
 * Implements Material Design 3 specifications.
 */

import { useId, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';

const selectVariants = cva(
  'relative w-full rounded-t-[4px] bg-surface-container-highest px-4 pb-2 pt-6 text-on-surface focus:outline-none transition-colors duration-200 ease-emphasized h-14 appearance-none cursor-pointer',
  {
    variants: {
      disabled: {
        true: 'bg-on-surface opacity-[0.04] cursor-not-allowed',
        false: 'bg-surface-container-highest cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

const animatedUnderline = cva(
  'absolute bottom-0 left-0 right-0 h-[2px] origin-center transition-transform duration-200 ease-out pointer-events-none',
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

const dropdownArrow = cva(
  'pointer-events-none absolute right-4 transition-transform duration-200 ease-emphasized',
  {
    variants: {
      focused: {
        true: 'rotate-180',
        false: 'rotate-0',
      },
      floating: {
        true: 'top-[22px]',
        false: 'top-[18px]',
      },
      disabled: {
        true: 'opacity-[0.38]',
        false: 'opacity-100',
      },
    },
    defaultVariants: {
      focused: false,
      floating: false,
      disabled: false,
    },
  },
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'disabled'>,
    VariantProps<typeof selectVariants> {
  label: string;
  options: SelectOption[];
  error?: boolean | null;
  errorMessage?: string;
  supportingText?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function Select({
  id,
  label,
  options,
  value,
  defaultValue,
  placeholder,
  error = false,
  errorMessage = '',
  supportingText = '',
  disabled = false,
  required = false,
  className = '',
  'data-testid': dataTestId = 'select',
  onChange,
  onBlur,
  onFocus,
  ...props
}: SelectProps & { 'data-testid'?: string; required?: boolean }) {
  const [isFocused, setIsFocused] = useState(false);

  const isControlled = value !== undefined;
  const hasValue = Boolean(value || defaultValue);
  const generatedId = useId();
  const selectId = id || generatedId;

  const errorId = `${selectId}-error`;
  const supportingTextId = `${selectId}-supporting-text`;
  const describedBy = error
    ? errorId
    : supportingText
      ? supportingTextId
      : undefined;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className='group relative' data-testid={dataTestId}>
      <label
        htmlFor={selectId}
        className={labelVariants({
          floating: !!isFocused || hasValue,
          error: !!error && !disabled,
          focused: !!isFocused,
          disabled: !!disabled,
        })}
      >
        {label}
      </label>

      <div className='relative block w-full'>
        <select
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          className={cn(
            selectVariants({
              disabled: !!disabled,
            }),
            error ? 'caret-error' : 'caret-primary',
            className,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={isControlled ? value : undefined}
          defaultValue={defaultValue}
          onChange={onChange}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className={dropdownArrow({
            focused: isFocused,
            floating: !!isFocused || hasValue,
            disabled: !!disabled,
          })}
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
        >
          <path
            d='M5 7.5L10 12.5L15 7.5'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={error ? 'text-error' : 'text-on-surface-variant'}
          />
        </svg>

        {!disabled && (
          <div aria-hidden='true' className={baseBorder({ error: !!error })} />
        )}

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
