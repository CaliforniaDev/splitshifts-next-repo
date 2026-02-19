import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cn } from '@/app/lib/utils';
import type { WeekStartsOn } from './types';
import {
  formatAriaDate,
  getMonthGrid,
  getWeekdayLabels,
  getDateKey,
  isSameDay,
  isBeforeDay,
  isAfterDay,
} from './utils';

interface CalendarGridProps {
  gridId?: string;
  headingId?: string;
  cellIdPrefix?: string;
  month: Date;
  selectedDate?: Date | null;
  focusedDate?: Date | null;
  weekStartsOn: WeekStartsOn;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  locale: string;
  onSelect: (date: Date) => void;
  onFocusDateChange?: (date: Date) => void;
  onDayKeyDown?: (event: ReactKeyboardEvent<HTMLButtonElement>, date: Date) => void;
  className?: string;
}

export function CalendarGrid({
  gridId,
  headingId,
  cellIdPrefix = 'date-cell',
  month,
  selectedDate,
  focusedDate,
  weekStartsOn,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  onSelect,
  onFocusDateChange,
  onDayKeyDown,
  className = '',
}: CalendarGridProps) {
  const days = getMonthGrid(month, weekStartsOn);
  const labels = getWeekdayLabels(weekStartsOn);
  const today = new Date();

  const isOutsideRange = (date: Date) => {
    if (minDate && isBeforeDay(date, minDate)) return true;
    if (maxDate && isAfterDay(date, maxDate)) return true;
    return false;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className='grid grid-cols-7 text-center typescale-label-small text-on-surface-variant'>
        {labels.map(label => (
          <span key={label} className='h-7 leading-7'>
            {label}
          </span>
        ))}
      </div>

      <div
        id={gridId}
        role='grid'
        aria-labelledby={headingId}
        className='grid grid-cols-7 gap-1'
      >
        {days.map(day => {
          const dateKey = getDateKey(day.date);
          const cellId = `${cellIdPrefix}-${dateKey}`;
          const isSelected = isSameDay(day.date, selectedDate);
          const isFocused = isSameDay(day.date, focusedDate);
          const isToday = isSameDay(day.date, today);
          const isDisabled = isOutsideRange(day.date) || isDateDisabled?.(day.date) === true;
          const isOutsideMonth = !day.isCurrentMonth;

          return (
            <button
              id={cellId}
              key={dateKey}
              type='button'
              role='gridcell'
              aria-selected={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={formatAriaDate(day.date, locale)}
              disabled={isDisabled}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => onSelect(day.date)}
              onFocus={() => onFocusDateChange?.(day.date)}
              onKeyDown={event => onDayKeyDown?.(event, day.date)}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors duration-200 ease-emphasized',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                !isSelected && !isDisabled && 'hover:bg-on-surface/8',
                isSelected && 'bg-primary text-on-primary',
                !isSelected && isToday && 'bg-primary/10 text-primary',
                isOutsideMonth && !isSelected && 'text-on-surface-variant/70',
                isDisabled && 'opacity-40 cursor-not-allowed',
              )}
            >
              <span className='relative z-10'>{day.date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
