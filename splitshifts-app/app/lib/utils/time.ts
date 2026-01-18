/**
 * Time Utilities
 * Pure functions for time conversion, validation, and formatting
 */

export type Period = 'AM' | 'PM';

/**
 * Convert 24-hour format to 12-hour format
 * @param hours24 - Hours in 24-hour format (0-23)
 * @returns Hours in 12-hour format (1-12)
 * @example
 * to12HourFormat(0)  // 12 (midnight)
 * to12HourFormat(13) // 1 (1 PM)
 * to12HourFormat(23) // 11 (11 PM)
 */
export function to12HourFormat(hours24: number): number {
  return hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
}

/**
 * Convert 12-hour format to 24-hour format
 * @param hours12 - Hours in 12-hour format (1-12)
 * @param period - 'AM' or 'PM'
 * @returns Hours in 24-hour format (0-23)
 * @example
 * to24HourFormat(12, 'AM') // 0 (midnight)
 * to24HourFormat(12, 'PM') // 12 (noon)
 * to24HourFormat(1, 'PM')  // 13
 */
export function to24HourFormat(hours12: number, period: Period): number {
  if (period === 'PM' && hours12 !== 12) return hours12 + 12;
  if (period === 'AM' && hours12 === 12) return 0;
  return hours12;
}

/**
 * Get AM/PM period from 24-hour time
 * @param hours24 - Hours in 24-hour format (0-23)
 * @returns 'AM' or 'PM'
 * @example
 * getPeriodFrom24Hour(0)  // 'AM'
 * getPeriodFrom24Hour(12) // 'PM'
 * getPeriodFrom24Hour(23) // 'PM'
 */
export function getPeriodFrom24Hour(hours24: number): Period {
  return hours24 >= 12 ? 'PM' : 'AM';
}

/**
 * Format time as "HH:MM AM/PM" string
 * @param hours - Hours in 12-hour format (1-12)
 * @param minutes - Minutes (0-59)
 * @param period - 'AM' or 'PM'
 * @returns Formatted time string
 * @example
 * formatTime(9, 30, 'AM')  // "09:30 AM"
 * formatTime(12, 0, 'PM')  // "12:00 PM"
 */
export function formatTime(
  hours: number,
  minutes: number,
  period: Period,
): string {
  const hrs = String(hours).padStart(2, '0');
  const mins = String(minutes).padStart(2, '0');
  return `${hrs}:${mins} ${period}`;
}

/**
 * Validate and clamp hours input (1-12)
 * @param value - String input from user
 * @returns Valid hours number (1-12)
 * @example
 * validateHours('5')   // 5
 * validateHours('0')   // 1 (clamped)
 * validateHours('15')  // 12 (clamped)
 * validateHours('abc') // 1 (invalid)
 */
export function validateHours(value: string): number {
  let numValue = parseInt(value, 10);

  if (isNaN(numValue) || numValue < 1) {
    return 1;
  } else if (numValue > 12) {
    return 12;
  }

  return numValue;
}

/**
 * Validate and clamp minutes input (0-59)
 * @param value - String input from user
 * @returns Valid minutes number (0-59)
 * @example
 * validateMinutes('30')  // 30
 * validateMinutes('-5')  // 0 (clamped)
 * validateMinutes('75')  // 59 (clamped)
 * validateMinutes('abc') // 0 (invalid)
 */
export function validateMinutes(value: string): number {
  let numValue = parseInt(value, 10);

  if (isNaN(numValue) || numValue < 0) {
    return 0;
  } else if (numValue > 59) {
    return 59;
  }

  return numValue;
}

/**
 * Initialize time state from Date object or default to 12:00 AM
 * @param date - Date object or null
 * @returns Object with hours (1-12), minutes (0-59), and period ('AM'|'PM')
 * @example
 * initializeTimeState(new Date('2024-01-15 14:30')) // { hours: 2, minutes: 30, period: 'PM' }
 * initializeTimeState(null) // { hours: 12, minutes: 0, period: 'AM' }
 */
export function initializeTimeState(date: Date | null): {
  hours: number;
  minutes: number;
  period: Period;
} {
  if (!date) {
    return { hours: 12, minutes: 0, period: 'AM' };
  }

  const hours24 = date.getHours();
  const minutes = date.getMinutes();

  return {
    hours: to12HourFormat(hours24),
    minutes,
    period: getPeriodFrom24Hour(hours24),
  };
}

/**
 * Create Date object from 12-hour time components
 * @param hours12 - Hours in 12-hour format (1-12)
 * @param minutes - Minutes (0-59)
 * @param period - 'AM' or 'PM'
 * @returns Date object with specified time (today's date)
 * @example
 * createDateFromTime(2, 30, 'PM') // Date object with 14:30:00
 * createDateFromTime(12, 0, 'AM') // Date object with 00:00:00
 */
export function createDateFromTime(
  hours12: number,
  minutes: number,
  period: Period,
): Date {
  const date = new Date();
  const hours24 = to24HourFormat(hours12, period);
  date.setHours(hours24, minutes, 0, 0);
  return date;
}
