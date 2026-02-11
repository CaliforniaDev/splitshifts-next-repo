'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/app/lib/utils';
import { Input } from '@/app/components/ui/inputs';
import { CalendarIcon } from '@/app/components/ui/icons/calendar-icon';

import type { DatePickerProps } from './types';
import { DEFAULT_WEEK_START } from './constants';
import { CalendarHeader } from './calendar-header';
import { CalendarGrid } from './calendar-grid';
import {
  addMonths,
  endOfMonth,
  formatDate,
  formatMonthLabel,
  isAfterDay,
  isBeforeDay,
  mergeDateAndTime,
  parseDateString,
  startOfMonth,
} from './utils';

const dropdownVariants = cva(
  'absolute z-50 rounded-2xl bg-surface-container-low text-on-surface shadow-elevation-2 p-4',
  {
    variants: {
      open: {
        true: '',
        false: 'opacity-0 pointer-events-none invisible',
      },
      direction: {
        down: 'top-full mt-2 origin-top',
        up: 'bottom-full mb-2 origin-bottom',
      },
    },
    compoundVariants: [
      { open: true, direction: 'down', className: 'animate-dropdown-fade-in' },
      { open: true, direction: 'up', className: 'animate-dropdown-fade-in-up' },
    ],
    defaultVariants: {
      open: false,
      direction: 'down',
    },
  },
);

export default function DatePicker({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  errorMessage = '',
  supportingText = '',
  disabled = false,
  required = false,
  className = '',
  iconPosition = 'start',
  placeholder = 'MM/DD/YYYY',
  locale = 'en-US',
  weekStartsOn = DEFAULT_WEEK_START,
  minDate,
  maxDate,
  isDateDisabled,
  dropdownClassName = '',
}: DatePickerProps) {
  const inputId = useId();
  const dropdownId = `${inputId}-calendar`;
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(value ?? new Date()),
  );
  const [inputValue, setInputValue] = useState(() =>
    value ? formatDate(value, locale) : '',
  );
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
    'down',
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing) return;
    setInputValue(value ? formatDate(value, locale) : '');
    if (value) {
      setVisibleMonth(startOfMonth(value));
    }
  }, [value, locale, isEditing]);

  const isDateAllowed = useCallback(
    (date: Date) => {
      if (minDate && isBeforeDay(date, minDate)) return false;
      if (maxDate && isAfterDay(date, maxDate)) return false;
      if (isDateDisabled && isDateDisabled(date)) return false;
      return true;
    },
    [minDate, maxDate, isDateDisabled],
  );

  const handleOpen = useCallback(() => {
    if (disabled) return;
    const parsed = parseDateString(inputValue);
    const reference = parsed ?? value ?? new Date();
    setVisibleMonth(startOfMonth(reference));
    setIsOpen(true);
  }, [disabled, inputValue, value]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    handleOpen();
  };

  const handleSelectDate = (date: Date) => {
    if (!isDateAllowed(date)) return;
    const nextDate = mergeDateAndTime(date, value ?? null);
    onChange?.(nextDate);
    setInputValue(formatDate(nextDate, locale));
    setVisibleMonth(startOfMonth(date));
    setIsOpen(false);
    setIsEditing(false);
    onBlur?.();
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const parsed = parseDateString(inputValue);
    if (parsed && isDateAllowed(parsed)) {
      const nextDate = mergeDateAndTime(parsed, value ?? null);
      onChange?.(nextDate);
      setInputValue(formatDate(nextDate, locale));
    } else {
      setInputValue(value ? formatDate(value, locale) : '');
    }
    onBlur?.();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setVisibleMonth(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setVisibleMonth(prev => addMonths(prev, 1));
  };

  const disablePrev = useMemo(() => {
    if (!minDate) return false;
    const prevMonth = addMonths(visibleMonth, -1);
    return isBeforeDay(endOfMonth(prevMonth), minDate);
  }, [minDate, visibleMonth]);

  const disableNext = useMemo(() => {
    if (!maxDate) return false;
    const nextMonth = addMonths(visibleMonth, 1);
    return isAfterDay(startOfMonth(nextMonth), maxDate);
  }, [maxDate, visibleMonth]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const updateDirection = () => {
      if (!containerRef.current || !dropdownRef.current) return;
      const anchor = containerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight || 0;
      const spaceBelow = window.innerHeight - anchor.bottom;
      const spaceAbove = anchor.top;
      const shouldOpenUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      setDropdownDirection(shouldOpenUp ? 'up' : 'down');
    };

    updateDirection();
    window.addEventListener('resize', updateDirection);
    window.addEventListener('scroll', updateDirection, true);
    return () => {
      window.removeEventListener('resize', updateDirection);
      window.removeEventListener('scroll', updateDirection, true);
    };
  }, [isOpen, visibleMonth]);

  return (
    <div ref={containerRef} className='relative w-full'>
      <Input
        id={inputId}
        label={label}
        type='text'
        icon={<CalendarIcon variant='outline' className='h-6' />}
        iconPosition={iconPosition}
        onIconClick={handleToggle}
        iconButtonAriaLabel='Open date picker'
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        error={error}
        errorMessage={errorMessage}
        supportingText={supportingText}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        inputMode='numeric'
        aria-haspopup='grid'
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        className={className}
      />

      <div
        id={dropdownId}
        role='dialog'
        aria-label='Date picker'
        ref={dropdownRef}
        className={cn(
          dropdownVariants({ open: isOpen, direction: dropdownDirection }),
          'w-full min-w-[280px] max-w-[328px]',
          dropdownClassName,
        )}
      >
        <CalendarHeader
          label={formatMonthLabel(visibleMonth, locale)}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          disablePrev={disablePrev}
          disableNext={disableNext}
        />

        <CalendarGrid
          month={visibleMonth}
          selectedDate={value}
          weekStartsOn={weekStartsOn}
          minDate={minDate}
          maxDate={maxDate}
          isDateDisabled={isDateDisabled}
          locale={locale}
          onSelect={handleSelectDate}
          className='pt-3'
        />
      </div>
    </div>
  );
}
