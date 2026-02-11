import type { CalendarDay, WeekStartsOn } from './types';
import { CALENDAR_WEEKS, WEEKDAY_LABELS } from './constants';

const DATE_INPUT_US = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const DATE_INPUT_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export const getDateKey = (date: Date): number =>
  date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

export const isSameDay = (a?: Date | null, b?: Date | null): boolean => {
  if (!a || !b) return false;
  return getDateKey(a) === getDateKey(b);
};

export const isSameMonth = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export const isBeforeDay = (a: Date, b: Date): boolean => getDateKey(a) < getDateKey(b);

export const isAfterDay = (a: Date, b: Date): boolean => getDateKey(a) > getDateKey(b);

export const startOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const endOfMonth = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

export const addMonths = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const getWeekdayLabels = (weekStartsOn: WeekStartsOn): string[] => {
  if (weekStartsOn === 0) return [...WEEKDAY_LABELS];
  return [...WEEKDAY_LABELS.slice(weekStartsOn), ...WEEKDAY_LABELS.slice(0, weekStartsOn)];
};

export const getMonthGrid = (month: Date, weekStartsOn: WeekStartsOn): CalendarDay[] => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDayOffset = (monthStart.getDay() - weekStartsOn + 7) % 7;
  const days: CalendarDay[] = [];

  if (startDayOffset > 0) {
    const prevMonth = addMonths(month, -1);
    const prevMonthDays = endOfMonth(prevMonth).getDate();
    for (let i = startDayOffset - 1; i >= 0; i -= 1) {
      const day = prevMonthDays - i;
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day),
        isCurrentMonth: false,
      });
    }
  }

  for (let day = 1; day <= monthEnd.getDate(); day += 1) {
    days.push({
      date: new Date(month.getFullYear(), month.getMonth(), day),
      isCurrentMonth: true,
    });
  }

  const totalCells = CALENDAR_WEEKS * 7;
  const remaining = totalCells - days.length;
  if (remaining > 0) {
    const nextMonth = addMonths(month, 1);
    for (let day = 1; day <= remaining; day += 1) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
        isCurrentMonth: false,
      });
    }
  }

  return days;
};

export const formatDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);

export const formatMonthLabel = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);

export const formatAriaDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

export const parseDateString = (rawValue: string): Date | null => {
  const value = rawValue.trim();
  if (!value) return null;

  const usMatch = DATE_INPUT_US.exec(value);
  if (usMatch) {
    const month = Number(usMatch[1]);
    const day = Number(usMatch[2]);
    const year = Number(usMatch[3]);
    return buildDateSafely(year, month, day);
  }

  const isoMatch = DATE_INPUT_ISO.exec(value);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    return buildDateSafely(year, month, day);
  }

  return null;
};

const buildDateSafely = (year: number, month: number, day: number): Date | null => {
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

export const mergeDateAndTime = (date: Date, timeSource?: Date | null): Date => {
  if (!timeSource) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeSource.getHours(),
    timeSource.getMinutes(),
    timeSource.getSeconds(),
    timeSource.getMilliseconds(),
  );
};
