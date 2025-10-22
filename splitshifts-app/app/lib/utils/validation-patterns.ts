/**
 * Common validation patterns used across the application
 * Centralized location for regex patterns to ensure consistency and reusability
 */

// UUID patterns

export const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Phone number patterns
export const PHONE_REGEX = /^\+?[\d\s\-\(\)]+$/;
export const US_PHONE_REGEX =
  /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
export const INTERNATIONAL_PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

// Email patterns (more strict than built-in validation)
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Name patterns
export const NAME_REGEX = /^[a-zA-Z\s\-'\.]+$/;
export const COMPANY_NAME_REGEX = /^[a-zA-Z0-9\s\-'\.&,]+$/;

// Address patterns
export const ADDRESS_REGEX = /^[a-zA-Z0-9\s\-'\.#,]+$/;
export const POSTAL_CODE_REGEX = /^[A-Za-z0-9\s\-]+$/;

// Security and access code patterns
export const ACCESS_CODE_REGEX = /^[A-Za-z0-9\#\*]+$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

// Time patterns (for shift scheduling)
export const TIME_24H_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
export const TIME_12H_REGEX = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i;

/**
 * Validation helper functions with descriptive error messages
 */
export const ValidationPatterns = {
  phone: {
    pattern: PHONE_REGEX,
    message:
      'Invalid phone number format. Use digits, spaces, hyphens, or parentheses.',
  },
  email: {
    pattern: EMAIL_REGEX,
    message: 'Invalid email format.',
  },
  name: {
    pattern: NAME_REGEX,
    message:
      'Name can only contain letters, spaces, hyphens, apostrophes, and periods.',
  },
  companyName: {
    pattern: COMPANY_NAME_REGEX,
    message:
      'Company name can only contain letters, numbers, spaces, and common punctuation.',
  },
  address: {
    pattern: ADDRESS_REGEX,
    message: 'Address contains invalid characters.',
  },
  accessCode: {
    pattern: ACCESS_CODE_REGEX,
    message: 'Access code can only contain letters, numbers, # and *.',
  },
} as const;
