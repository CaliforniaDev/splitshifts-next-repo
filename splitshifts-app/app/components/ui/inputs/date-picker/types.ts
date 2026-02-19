import type { HTMLAttributes } from 'react';

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DatePickerProps {
  label: string;
  value?: Date | null;
  onChange?: (newValue: Date | null) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
  supportingText?: string;
  showFormatHint?: boolean;
  formatHint?: string;
  invalidDateMessage?: string;
  outOfRangeDateMessage?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  iconPosition?: 'start' | 'end';
  placeholder?: string;
  locale?: string;
  weekStartsOn?: WeekStartsOn;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  dropdownClassName?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}
