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
  month: Date;
  selectedDate?: Date | null;
  weekStartsOn: WeekStartsOn;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  locale: string;
  onSelect: (date: Date) => void;
  className?: string;
}

export function CalendarGrid({
  month,
  selectedDate,
  weekStartsOn,
  minDate,
  maxDate,
  isDateDisabled,
  locale,
  onSelect,
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

      <div role='grid' className='grid grid-cols-7 gap-1'>
        {days.map(day => {
          const isSelected = isSameDay(day.date, selectedDate);
          const isToday = isSameDay(day.date, today);
          const isDisabled = isOutsideRange(day.date) || isDateDisabled?.(day.date) === true;
          const isOutsideMonth = !day.isCurrentMonth;

          return (
            <button
              key={getDateKey(day.date)}
              type='button'
              role='gridcell'
              aria-selected={isSelected}
              aria-label={formatAriaDate(day.date, locale)}
              disabled={isDisabled}
              onClick={() => onSelect(day.date)}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors duration-200 ease-emphasized',
                'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                !isSelected && !isDisabled && 'hover:bg-on-surface/8',
                isSelected && 'bg-primary text-on-primary',
                !isSelected && isToday && 'border border-primary text-primary',
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
