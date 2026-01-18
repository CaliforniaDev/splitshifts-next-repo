'use client';

/**
 * SelectMenu - Custom dropdown with ripple effects, floating labels, and keyboard navigation.
 * Implements Material Design 3 specifications with three-layer border system.
 */

import { useId, useState, useRef, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';

import { CheckIcon } from '@/app/components/ui/icons/check-icon';

// Constants
const DROPDOWN_MAX_HEIGHT = 260; // max-h-60 (240px) + padding/margin

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
  'absolute z-50 w-full bg-surface-container-low text-on-surface rounded-2xl shadow-elevation-2 max-h-60 overflow-y-auto p-1 space-y-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-outline-variant',
  {
    variants: {
      open: {
        true: '',
        false: 'opacity-0 pointer-events-none invisible',
      },
      direction: {
        down: 'top-full mt-1 origin-top',
        up: 'bottom-full mb-1 origin-bottom',
      },
    },
    compoundVariants: [
      {
        open: true,
        direction: 'down',
        className: 'animate-dropdown-fade-in',
      },
      {
        open: true,
        direction: 'up',
        className: 'animate-dropdown-fade-in-up',
      },
    ],
    defaultVariants: {
      open: false,
      direction: 'down',
    },
  },
);

const menuItemVariants = cva(
  'relative p-3 border-radius cursor-pointer text-on-surface typescale-label-large transition-colors duration-200 ease-emphasized before:absolute before:inset-0 before:z-[1] before:transition-opacity before:duration-200 before:bg-current before:opacity-0',
  {
    variants: {
      selected: {
        true: 'bg-tertiary-container text-on-tertiary-container hover:before:opacity-8 rounded-xl',
        false: 'rounded hover:bg-on-surface/8',
      },
      active: {
        true: 'before:opacity-8', // Show overlay when navigating with arrow keys
        false: null,
      },
      disabled: {
        true: 'opacity-[0.38] cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
      active: false,
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
  isActive: boolean;
  id?: string;
  onSelect: (value: string) => void;
}> = ({ option, isSelected, isActive, id, onSelect }) => {
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
      id={id}
      role='option'
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={cn(
        menuItemVariants({
          selected: isSelected,
          active: isActive,
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
      <div 
        key={isSelected ? 'selected' : 'unselected'}
        className={cn(
          'relative z-[2] flex items-center gap-2',
          isSelected && 'animate-slide-right'
        )}
      >
        {isSelected ? (
          <CheckIcon className='h-5 w-5 text-current' />
        ) : null}
        <span>{option.label}</span>
      </div>

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
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || value || '',
  );
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Extract ref from props if it exists (from React Hook Form)
  // Type assertion needed because ref can be callback or object, and props typing doesn't expose it
  const { ref: externalRef, ...restProps } = props as React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
  
  // Merge refs: set both internal ref (for positioning) and external ref (for React Hook Form)
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    
    // React Hook Form uses callback refs
    if (typeof externalRef === 'function') {
      externalRef(node);
    }
  }, [externalRef]);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : selectedValue;
  const hasValue = Boolean(currentValue);
  const isActive = isOpen || isFocused;
  const selectedIndex = options.findIndex(option => option.value === currentValue);
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

  // Auto-scroll active item into view with extra padding
  useEffect(() => {
    if (activeIndex !== null && menuRef.current) {
      const activeElement = menuRef.current.querySelector(
        `[id="${selectId}-option-${activeIndex}"]`
      ) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex, selectId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          setActiveIndex(null);
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

  const getNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (!options.length) return -1;
    const normalizedStartIndex = startIndex < 0 ? (direction === 1 ? -1 : 0) : startIndex;

    for (let i = 1; i <= options.length; i += 1) {
      const index = (normalizedStartIndex + direction * i + options.length) % options.length;
      if (!options[index]?.disabled) return index;
    }

    return -1;
  };

  const getInitialActiveIndex = () => {
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
      return selectedIndex;
    }

    const firstEnabledIndex = getNextEnabledIndex(-1, 1);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : null;
  };

  const handleToggle = () => {
    if (!disabled) {
      const willBeOpen = !isOpen;
      
      // Set open state first
      setIsOpen(willBeOpen);
      // Don't set activeIndex on click - only keyboard navigation should set it
      if (!willBeOpen) {
        setActiveIndex(null);
      }
      
      // Calculate dropdown direction when opening
      // Use requestAnimationFrame to ensure DOM has updated
      if (willBeOpen) {
        requestAnimationFrame(() => {
          if (!containerRef.current) {
            return;
          }
          
          const rect = containerRef.current.getBoundingClientRect();
          
          // Find the closest scrollable ancestor
          let scrollParent = containerRef.current.parentElement;
          while (scrollParent) {
            const style = window.getComputedStyle(scrollParent);
            const overflowY = style.overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
              break;
            }
            scrollParent = scrollParent.parentElement;
          }
          
          // Calculate available space considering both scroll container and viewport
          let spaceBelow: number;
          let spaceAbove: number;
          
          if (scrollParent) {
            // Calculate space within the scroll container
            const scrollParentRect = scrollParent.getBoundingClientRect();
            const spaceInContainerBelow = scrollParentRect.bottom - rect.bottom;
            const spaceInContainerAbove = rect.top - scrollParentRect.top;
            
            // Also consider viewport boundaries
            const spaceInViewportBelow = window.innerHeight - rect.bottom;
            const spaceInViewportAbove = rect.top;
            
            // Use the more restrictive boundary (minimum available space)
            spaceBelow = Math.min(spaceInContainerBelow, spaceInViewportBelow);
            spaceAbove = Math.min(spaceInContainerAbove, spaceInViewportAbove);
          } else {
            // No scroll container, use viewport
            spaceBelow = window.innerHeight - rect.bottom;
            spaceAbove = rect.top;
          }
          
          // Position menu to avoid being cut off:
          // - Open upward if not enough space below AND more space above
          // - Otherwise open downward (default)
          const direction = spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow ? 'up' : 'down';
          
          setDropdownDirection(direction);
        });
      }
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setSelectedValue(optionValue);
    }

    onChange?.(optionValue);
    
    // Delay closing to allow animation to complete (400ms animation + 100ms buffer)
    setTimeout(() => {
      setIsOpen(false);
      setActiveIndex(null);
    }, 500);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      setIsFocused(false);
      setActiveIndex(null);
      onBlur?.(e);
    }
  };

  const moveActiveIndex = (direction: 1 | -1) => {
    const startIndex = activeIndex ?? selectedIndex;
    const nextIndex = getNextEnabledIndex(startIndex, direction);
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
        // Set initial active index only when using keyboard
        setActiveIndex(getInitialActiveIndex());
        return;
      }
      moveActiveIndex(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) {
        handleToggle();
        return;
      }

      if (activeIndex !== null && activeIndex >= 0) {
        const option = options[activeIndex];
        if (option && !option.disabled) {
          handleSelect(option.value);
        }
      }
      return;
    }

    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(null);
    }
  };

  return (
    <div
      ref={setRefs}
      className='group relative'
      data-testid={dataTestId}
      onBlur={handleBlur}
      {...restProps}
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
          floating: isActive || hasValue,
          error: !!error && !disabled,
          focused: isActive,
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
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleTriggerKeyDown}
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
              focused: isActive,
              error: !!error,
            })}
          />
        )}

        {!disabled && (
          <div
            aria-hidden='true'
            className={hoverOverlay({ focused: isActive })}
          ></div>
        )}

        <div
          ref={menuRef}
          role='listbox'
          className={menuVariants({ open: isOpen, direction: dropdownDirection })}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option.value}
              id={`${selectId}-option-${index}`}
              option={option}
              isSelected={currentValue === option.value}
              isActive={activeIndex === index}
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
