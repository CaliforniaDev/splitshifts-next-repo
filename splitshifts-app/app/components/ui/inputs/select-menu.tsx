'use client';

/**
 * SelectMenu - Custom dropdown with ripple effects, floating labels, and keyboard navigation.
 * Implements Material Design 3 specifications with three-layer border system.
 */

import { useId, useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';

const selectVariants = cva(
  'relative w-full rounded-t-[4px] bg-surface-container-highest px-4 pb-2 pt-6 text-on-surface focus:outline-none transition-colors duration-200 ease-emphasized h-14 cursor-pointer',
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
        false:
          'typescale-body-large pt-4 transition-all duration-200 ease-in-out',
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
      open: {
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
      open: false,
      floating: false,
      disabled: false,
    },
  },
);

const menuVariants = cva(
  'absolute z-50 w-full mt-1 bg-surface-container rounded-[4px] shadow-elevation-2 max-h-60 overflow-y-auto origin-top',
  {
    variants: {
      open: {
        true: 'animate-dropdown-fade-in',
        false: 'opacity-0 pointer-events-none invisible',
      },
    },
    defaultVariants: {
      open: false,
    },
  },
);

const menuItemVariants = cva(
  'relative px-4 py-3 cursor-pointer text-on-surface typescale-body-large transition-colors duration-200 ease-emphasized',
  {
    variants: {
      selected: {
        true: 'bg-secondary-container',
        false: 'hover:bg-on-surface/8',
      },
      disabled: {
        true: 'opacity-[0.38] cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  },
);

export interface SelectMenuOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const MenuItem: React.FC<{
  option: SelectMenuOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}> = ({ option, isSelected, onSelect }) => {
  const rippleConfig: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: option.disabled,
  };

  const mergedConfig: Required<RippleConfig> = {
    ...RIPPLE_DEFAULTS,
    ...rippleConfig,
    disabled: option.disabled || false,
  };

  const { ripples, rippleRef, handleMouseDown, handleMouseUp, removeRipple } =
    useRipple(rippleConfig);

  const handleClick = () => {
    if (!option.disabled) {
      onSelect(option.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !option.disabled) {
      e.preventDefault();
      onSelect(option.value);
    }
  };

  const handleMouseDownWithPrevent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleMouseDown(e as React.MouseEvent<HTMLElement>);
  };

  return (
    <div
      ref={rippleRef as React.RefObject<HTMLDivElement>}
      role='option'
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={cn(
        menuItemVariants({
          selected: isSelected,
          disabled: option.disabled,
        }),
        'overflow-hidden',
      )}
      onMouseDown={handleMouseDownWithPrevent}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className='relative z-10'>{option.label}</span>

      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          {...ripple}
          config={mergedConfig}
          keyframeName='MenuItem'
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}

      <RippleKeyframes name='MenuItem' config={mergedConfig} />
    </div>
  );
};

interface SelectMenuProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      'onChange' | 'defaultValue'
    >,
    VariantProps<typeof selectVariants> {
  label: string;
  options: SelectMenuOption[];
  value?: string;
  defaultValue?: string;
  error?: boolean | null;
  errorMessage?: string;
  supportingText?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  name?: string;
}

export default function SelectMenu({
  id,
  label,
  options,
  value,
  defaultValue,
  placeholder,
  name,
  error = false,
  errorMessage = '',
  supportingText = '',
  disabled = false,
  className = '',
  'data-testid': dataTestId = 'select-menu',
  onChange,
  onBlur,
  ...props
}: SelectMenuProps & { 'data-testid'?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || value || '',
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;
  const hasValue = Boolean(currentValue);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find(opt => opt.value === currentValue);
  const displayValue = selectedOption?.label || placeholder || '';

  const errorId = `${selectId}-error`;
  const supportingTextId = `${selectId}-supporting-text`;
  const describedBy = error
    ? errorId
    : supportingText
      ? supportingTextId
      : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case 'ArrowDown':
          event.preventDefault();
          break;
        case 'ArrowUp':
          event.preventDefault();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setSelectedValue(optionValue);
    }

    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      onBlur?.(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className='group relative'
      data-testid={dataTestId}
      onBlur={handleBlur}
      {...props}
    >
      <input
        type='hidden'
        name={name}
        value={currentValue}
        id={selectId}
        aria-invalid={!!error}
      />

      <label
        htmlFor={selectId}
        className={labelVariants({
          floating: isOpen || hasValue,
          error: !!error && !disabled,
          focused: isOpen,
          disabled: !!disabled,
        })}
      >
        {label}
      </label>

      <div className='relative block w-full'>
        <div
          role='button'
          tabIndex={disabled ? -1 : 0}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-labelledby={selectId}
          aria-describedby={describedBy}
          className={cn(
            selectVariants({
              disabled: !!disabled,
            }),
            error ? 'caret-error' : 'caret-primary',
            !hasValue && !isOpen && 'text-on-surface-variant',
            className,
          )}
          onClick={handleToggle}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          {displayValue}
        </div>

        <svg
          className={dropdownArrow({
            open: isOpen,
            floating: isOpen || hasValue,
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
              focused: isOpen,
              error: !!error,
            })}
          />
        )}

        {!disabled && (
          <div
            aria-hidden='true'
            className={hoverOverlay({ focused: isOpen })}
          ></div>
        )}

        <div
          ref={menuRef}
          role='listbox'
          className={menuVariants({ open: isOpen })}
        >
          {options.map(option => (
            <MenuItem
              key={option.value}
              option={option}
              isSelected={currentValue === option.value}
              onSelect={handleSelect}
            />
          ))}
        </div>
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
