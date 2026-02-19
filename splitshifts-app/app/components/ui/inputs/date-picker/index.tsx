'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
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
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfWeek,
  formatDate,
  formatMonthLabel,
  formatDateInput,
  getDateInputCaretPosition,
  getDateKey,
  getMonthGrid,
  isAfterDay,
  isBeforeDay,
  isSameDay,
  mergeDateAndTime,
  parseDateString,
  startOfMonth,
  startOfWeek,
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

const DEFAULT_INVALID_DATE_MESSAGE = 'Enter a valid date (MM/DD/YYYY).';
const DEFAULT_OUT_OF_RANGE_DATE_MESSAGE = 'This date is outside the allowed range.';
const MAX_NAVIGATION_ATTEMPTS = 3660;

const alignDateToMonth = (baseDate: Date, monthStart: Date): Date => {
  const maxDay = endOfMonth(monthStart).getDate();
  const clampedDay = Math.min(baseDate.getDate(), maxDay);
  return new Date(monthStart.getFullYear(), monthStart.getMonth(), clampedDay);
};

export default function DatePicker({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  errorMessage = '',
  supportingText = '',
  showFormatHint = true,
  formatHint = 'Type 8 digits (MMDDYYYY) — slashes auto-added',
  invalidDateMessage = DEFAULT_INVALID_DATE_MESSAGE,
  outOfRangeDateMessage = DEFAULT_OUT_OF_RANGE_DATE_MESSAGE,
  disabled = false,
  required = false,
  className = '',
  iconPosition = 'start',
  placeholder = 'MM/DD/YYYY',
  inputMode = 'numeric',
  locale = 'en-US',
  weekStartsOn = DEFAULT_WEEK_START,
  minDate,
  maxDate,
  isDateDisabled,
  dropdownClassName = '',
}: DatePickerProps) {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const dropdownId = `${inputId}-calendar`;
  const monthLabelId = `${inputId}-month-label`;
  const gridId = `${inputId}-grid`;
  const cellIdPrefix = `${inputId}-cell`;
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(value ?? new Date()),
  );
  const [focusedDate, setFocusedDate] = useState<Date | null>(value ?? null);
  const [inputValue, setInputValue] = useState(() =>
    value ? formatDate(value, locale) : '',
  );
  const [internalErrorMessage, setInternalErrorMessage] = useState('');
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
    'down',
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastEmittedDateKeyRef = useRef<number | null>(
    value ? getDateKey(value) : null,
  );

  useEffect(() => {
    if (isEditing) return;
    // Intentionally sync external value into the local draft when editing is inactive.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value ? formatDate(value, locale) : '');
    setInternalErrorMessage('');
    if (value) {
      setVisibleMonth(startOfMonth(value));
      setFocusedDate(value);
    }
  }, [value, locale, isEditing]);

  useEffect(() => {
    lastEmittedDateKeyRef.current = value ? getDateKey(value) : null;
  }, [value]);

  const isDateAllowed = useCallback(
    (date: Date) => {
      if (minDate && isBeforeDay(date, minDate)) return false;
      if (maxDate && isAfterDay(date, maxDate)) return false;
      if (isDateDisabled && isDateDisabled(date)) return false;
      return true;
    },
    [minDate, maxDate, isDateDisabled],
  );

  const emitDateChange = useCallback(
    (nextDate: Date | null): boolean => {
      const nextDateKey = nextDate ? getDateKey(nextDate) : null;
      if (lastEmittedDateKeyRef.current === nextDateKey) {
        return false;
      }
      onChange?.(nextDate);
      lastEmittedDateKeyRef.current = nextDateKey;
      return true;
    },
    [onChange],
  );

  const resolveFocusableDate = useCallback(
    (month: Date, preferredDate?: Date | null): Date | null => {
      const days = getMonthGrid(month, weekStartsOn);
      const candidateDates = [
        preferredDate ?? null,
        value ?? null,
        new Date(),
      ].filter((candidate): candidate is Date => candidate !== null);

      for (const candidate of candidateDates) {
        const matchingDay = days.find(
          day => isSameDay(day.date, candidate) && isDateAllowed(day.date),
        );
        if (matchingDay) return matchingDay.date;
      }

      const currentMonthDay = days.find(
        day => day.isCurrentMonth && isDateAllowed(day.date),
      );
      if (currentMonthDay) return currentMonthDay.date;

      const firstAllowed = days.find(day => isDateAllowed(day.date));
      return firstAllowed?.date ?? null;
    },
    [isDateAllowed, value, weekStartsOn],
  );

  const focusInputField = useCallback(() => {
    const inputElement = document.getElementById(inputId);
    if (inputElement instanceof HTMLInputElement) {
      inputElement.focus();
    }
  }, [inputId]);

  const closePicker = useCallback(
    (restoreInputFocus = false) => {
      setIsOpen(false);
      if (!restoreInputFocus) return;
      requestAnimationFrame(() => {
        focusInputField();
      });
    },
    [focusInputField],
  );

  const handleOpen = useCallback(() => {
    if (disabled) return;
    const parsed = parseDateString(inputValue);
    const reference = parsed && isDateAllowed(parsed) ? parsed : value ?? new Date();
    const nextVisibleMonth = startOfMonth(reference);
    setVisibleMonth(nextVisibleMonth);
    setFocusedDate(resolveFocusableDate(nextVisibleMonth, reference));
    setIsOpen(true);
  }, [disabled, inputValue, isDateAllowed, resolveFocusableDate, value]);

  const handleToggle = () => {
    if (isOpen) {
      closePicker();
      return;
    }
    handleOpen();
  };

  const applyValidDate = useCallback(
    (parsedDate: Date, shouldNormalizeInput: boolean) => {
      const nextDate = mergeDateAndTime(parsedDate, value ?? null);
      emitDateChange(nextDate);
      setVisibleMonth(startOfMonth(parsedDate));
      setFocusedDate(parsedDate);
      if (shouldNormalizeInput) {
        setInputValue(formatDate(nextDate, locale));
      }
      setInternalErrorMessage('');
      return nextDate;
    },
    [emitDateChange, locale, value],
  );

  const findAllowedDateInDirection = useCallback(
    (startDate: Date, direction: 1 | -1): Date | null => {
      let candidate = startDate;

      for (let attempt = 0; attempt < MAX_NAVIGATION_ATTEMPTS; attempt += 1) {
        if (isDateAllowed(candidate)) return candidate;
        candidate = addDays(candidate, direction);
      }

      return null;
    },
    [isDateAllowed],
  );

  const shiftDateByMonths = useCallback((date: Date, amount: number) => {
    const monthStart = addMonths(new Date(date.getFullYear(), date.getMonth(), 1), amount);
    return alignDateToMonth(date, monthStart);
  }, []);

  const shiftDateByYears = useCallback((date: Date, amount: number) => {
    const yearStart = addYears(new Date(date.getFullYear(), date.getMonth(), 1), amount);
    return alignDateToMonth(date, yearStart);
  }, []);

  const moveFocusByMonth = useCallback(
    (amount: number) => {
      const nextMonth = addMonths(visibleMonth, amount);
      setVisibleMonth(nextMonth);

      const baseDate = focusedDate ?? value ?? new Date();
      const alignedDate = alignDateToMonth(baseDate, nextMonth);
      setFocusedDate(resolveFocusableDate(nextMonth, alignedDate));
    },
    [focusedDate, resolveFocusableDate, value, visibleMonth],
  );

  const focusDayCell = useCallback(
    (date: Date | null) => {
      if (!date) return;
      const cellId = `${cellIdPrefix}-${getDateKey(date)}`;
      const target = document.getElementById(cellId);
      if (target instanceof HTMLButtonElement && !target.disabled) {
        target.focus();
      }
    },
    [cellIdPrefix],
  );

  const handleSelectDate = (date: Date) => {
    if (!isDateAllowed(date)) return;
    applyValidDate(date, true);
    closePicker(true);
    setIsEditing(false);
    onBlur?.();
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget instanceof Node &&
      containerRef.current?.contains(relatedTarget)
    ) {
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    if (!inputValue.trim()) {
      setInternalErrorMessage('');
      emitDateChange(null);
      onBlur?.();
      return;
    }

    const parsed = parseDateString(inputValue);
    if (parsed && isDateAllowed(parsed)) {
      applyValidDate(parsed, true);
    } else {
      setInternalErrorMessage(
        parsed ? outOfRangeDateMessage : invalidDateMessage,
      );
    }
    onBlur?.();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.currentTarget;
    const rawValue = inputElement.value;
    const caretIndex = inputElement.selectionStart ?? rawValue.length;
    const digitsBeforeCaret = rawValue.slice(0, caretIndex).replace(/\D/g, '').length;
    const { formatted, digits } = formatDateInput(rawValue);

    setInputValue(formatted);
    if (digits.length < 8) {
      setInternalErrorMessage('');
    }

    if (digits.length === 8) {
      const parsed = parseDateString(formatted);
      if (!parsed) {
        setInternalErrorMessage(invalidDateMessage);
      } else if (!isDateAllowed(parsed)) {
        setInternalErrorMessage(outOfRangeDateMessage);
      } else {
        applyValidDate(parsed, false);
      }
    }

    const nextCaret = Math.min(
      getDateInputCaretPosition(digitsBeforeCaret),
      formatted.length,
    );

    requestAnimationFrame(() => {
      if (!inputElement.isConnected) return;
      inputElement.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      handleOpen();
      return;
    }

    if (event.key === 'ArrowDown' && isOpen) {
      event.preventDefault();
      focusDayCell(resolvedFocusedDate);
      return;
    }

    if (event.key === 'Escape') {
      closePicker();
    }
  };

  const resolvedError = error || Boolean(internalErrorMessage);
  const resolvedErrorMessage = error ? errorMessage : internalErrorMessage;
  const resolvedFocusedDate =
    focusedDate && isDateAllowed(focusedDate)
      ? focusedDate
      : isOpen
        ? resolveFocusableDate(visibleMonth)
        : focusedDate;

  const handlePrevMonth = () => {
    moveFocusByMonth(-1);
  };

  const handleNextMonth = () => {
    moveFocusByMonth(1);
  };

  const handleDayKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) => {
    const isShift = event.shiftKey;
    let targetDate: Date | null = null;
    let direction: 1 | -1 = 1;

    switch (event.key) {
      case 'ArrowLeft':
        targetDate = addDays(date, -1);
        direction = -1;
        break;
      case 'ArrowRight':
        targetDate = addDays(date, 1);
        direction = 1;
        break;
      case 'ArrowUp':
        targetDate = addDays(date, -7);
        direction = -1;
        break;
      case 'ArrowDown':
        targetDate = addDays(date, 7);
        direction = 1;
        break;
      case 'Home':
        targetDate = startOfWeek(date, weekStartsOn);
        direction = 1;
        break;
      case 'End':
        targetDate = endOfWeek(date, weekStartsOn);
        direction = -1;
        break;
      case 'PageUp':
        targetDate = isShift ? shiftDateByYears(date, -1) : shiftDateByMonths(date, -1);
        direction = -1;
        break;
      case 'PageDown':
        targetDate = isShift ? shiftDateByYears(date, 1) : shiftDateByMonths(date, 1);
        direction = 1;
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        handleSelectDate(date);
        return;
      case 'Escape':
        event.preventDefault();
        closePicker(true);
        return;
      default:
        return;
    }

    event.preventDefault();
    if (!targetDate) return;

    const nextFocusedDate = findAllowedDateInDirection(targetDate, direction);
    if (!nextFocusedDate) return;

    setFocusedDate(nextFocusedDate);
    setVisibleMonth(startOfMonth(nextFocusedDate));
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
        closePicker();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [closePicker, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePicker(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closePicker, isOpen]);

  useEffect(() => {
    if (!isOpen || !resolvedFocusedDate) return;
    const frame = requestAnimationFrame(() => {
      focusDayCell(resolvedFocusedDate);
    });
    return () => cancelAnimationFrame(frame);
  }, [focusDayCell, isOpen, resolvedFocusedDate, visibleMonth]);

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
        error={resolvedError}
        errorMessage={resolvedErrorMessage}
        supportingText={
          showFormatHint
            ? [supportingText, formatHint].filter(Boolean).join(' · ')
            : supportingText
        }
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-haspopup='grid'
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        className={className}
      />

      <div
        id={dropdownId}
        role='dialog'
        aria-modal='false'
        aria-label='Date picker'
        ref={dropdownRef}
        className={cn(
          dropdownVariants({ open: isOpen, direction: dropdownDirection }),
          'w-full min-w-[280px] max-w-[328px]',
          dropdownClassName,
        )}
      >
        {isOpen ? (
          <p className='sr-only' aria-live='polite' aria-atomic='true'>
            {formatMonthLabel(visibleMonth, locale)}
          </p>
        ) : null}

        <CalendarHeader
          labelId={monthLabelId}
          label={formatMonthLabel(visibleMonth, locale)}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
          disablePrev={disablePrev}
          disableNext={disableNext}
        />

        <CalendarGrid
          gridId={gridId}
          headingId={monthLabelId}
          cellIdPrefix={cellIdPrefix}
          month={visibleMonth}
          selectedDate={value}
          focusedDate={resolvedFocusedDate}
          weekStartsOn={weekStartsOn}
          minDate={minDate}
          maxDate={maxDate}
          isDateDisabled={isDateDisabled}
          locale={locale}
          onSelect={handleSelectDate}
          onFocusDateChange={setFocusedDate}
          onDayKeyDown={handleDayKeyDown}
          className='pt-3'
        />
      </div>
    </div>
  );
}
