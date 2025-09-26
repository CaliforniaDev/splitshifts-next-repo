import { getTimeZones } from '@vvo/tzdb';

// Curated list of common timezones that businesses typically need
const COMMON_TIMEZONE_NAMES = [
  // US Timezones
  'America/New_York', // Eastern Time
  'America/Chicago', // Central Time
  'America/Denver', // Mountain Time
  'America/Los_Angeles', // Pacific Time
  'America/Anchorage', // Alaska Time
  'Pacific/Honolulu', // Hawaii Time

  // Canada
  'America/Toronto', // Eastern Time - Toronto
  'America/Vancouver', // Pacific Time - Vancouver
  'America/Winnipeg', // Central Time - Canada

  // Europe
  'Europe/London', // Greenwich Mean Time
  'Europe/Paris', // Central European Time
  'Europe/Berlin', // Central European Time
  'Europe/Rome', // Central European Time
  'Europe/Madrid', // Central European Time
  'Europe/Amsterdam', // Central European Time

  // Asia Pacific
  'Asia/Tokyo', // Japan Standard Time
  'Asia/Shanghai', // China Standard Time
  'Asia/Hong_Kong', // Hong Kong Time
  'Asia/Singapore', // Singapore Standard Time
  'Asia/Kolkata', // India Standard Time
  'Australia/Sydney', // Australian Eastern Time
  'Australia/Melbourne', // Australian Eastern Time
  'Australia/Perth', // Australian Western Time

  // Other Common
  'UTC', // Coordinated Universal Time
] as const;

// Get all available timezones from the library
const allTimeZones = getTimeZones();

// Create timezone options with user-friendly labels
export const TIMEZONE_OPTIONS = allTimeZones
  .filter(tz => COMMON_TIMEZONE_NAMES.includes(tz.name as any))
  .map(tz => ({
    value: tz.name,
    label: `${tz.alternativeName} (${tz.abbreviation})`,
    group: tz.group[0], // First part of the group (e.g., "America", "Europe")
  }))
  .sort((a, b) => {
    // Sort by group first, then by label
    if (a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }
    return a.label.localeCompare(b.label);
  });

// Extract timezone values for validation schemas
export const TIMEZONE_VALUES = TIMEZONE_OPTIONS.map(option => option.value) as [
  string,
  ...string[],
];

// Default timezone (can be configured based on organization/user preference)
export const DEFAULT_TIMEZONE = 'America/New_York';

// Utility function to get timezone display name
export const getTimezoneLabel = (timezoneValue: string): string => {
  const option = TIMEZONE_OPTIONS.find(tz => tz.value === timezoneValue);
  return option?.label || timezoneValue;
};

// Utility function to get current time in a specific timezone
export const getCurrentTimeInTimezone = (timezone: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date());
};
