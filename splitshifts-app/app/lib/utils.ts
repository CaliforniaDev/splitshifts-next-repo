import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomBytes } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  const maskedLocal = local[0] + '*'.repeat(Math.max(0, local.length - 1));
  const [domainName, domainExt] = domain.split('.');
  const maskedDomain =
    domainName[0] + '*'.repeat(Math.max(0, domainName.length - 1));

  return `${maskedLocal}@${maskedDomain}.${domainExt}`;
}

// ---Token Management Constants and Utilities--------------------------------

/**
 * Token generation configuration
 * Centralized constants to ensure consistency between token generation and validation
 * 
 * Security Design Decisions:
 * - 256-bit entropy (32 bytes -> 64 hex chars) provides cryptographically strong randomness
 * - Hex format chosen over JWT for simplicity and revocability requirements
 * - Database-managed expiration allows immediate token revocation
 * - Stateful tokens enable better security controls vs stateless JWT
 */
export const TOKEN_CONFIG = {
  /** Number of random bytes to generate for tokens (256-bit entropy) */
  BYTE_LENGTH: 32,
  /** Expected character length of hex-encoded token (BYTE_LENGTH * 2) */
  HEX_LENGTH: 64,
  /** Regex pattern for validating hex-encoded tokens */
  VALIDATION_PATTERN: /^[a-fA-F0-9]{64}$/,
} as const;

/**
 * Generates a cryptographically secure token using the standardized format
 * 
 * Provides 256-bit entropy using Node.js crypto.randomBytes() which is
 * cryptographically secure and suitable for authentication tokens.
 * 
 * Token format considerations:
 * - Hex tokens: Simple, stateful, revokable, require database validation
 * - JWT alternative: Self-contained but larger, harder to revoke, more complex
 * 
 * We chose hex tokens because email verification and password reset require:
 * 1. Database interaction anyway (to update user state)
 * 2. Immediate revocability (user changes email, security incidents)
 * 3. Simple implementation with minimal attack surface
 * 
 * @returns A 64-character hexadecimal token string with 256-bit entropy
 */
export function generateSecureToken(): string {
  return randomBytes(TOKEN_CONFIG.BYTE_LENGTH).toString('hex');
}

/**
 * Validates that a token matches the expected format
 * Ensures consistency with token generation method
 * 
 * @param token - The token string to validate
 * @returns true if the token is valid format, false otherwise
 */
export function isValidTokenFormat(token: unknown): token is string {
  return typeof token === 'string' && TOKEN_CONFIG.VALIDATION_PATTERN.test(token);
}

/**
 * Centralized error logging utility that handles environment-specific logging
 * In development: logs detailed error information
 * In production: logs generic error message for security
 * 
 * @param message - The error message context
 * @param error - The actual error object (optional)
 */
export function logError(message: string, error?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${message}:`, error);
  } else {
    console.error(`${message} occurred.`);
  }
}

/**
 * Validates and returns the site base URL from environment variables
 * Ensures the URL is properly formatted and removes trailing slashes
 * In production: enforces HTTPS for security
 * In development: allows HTTP or HTTPS for flexibility
 * 
 * @throws Error if SITE_BASE_URL is missing or malformed
 * @returns The validated and normalized base URL
 */
export function getValidatedSiteBaseUrl(): string {
  const siteBaseUrl = process.env.SITE_BASE_URL;
  
  if (!siteBaseUrl) {
    // In production, try to infer from Vercel environment variables
    if (process.env.NODE_ENV === 'production') {
      const vercelUrl = process.env.VERCEL_URL;
      if (vercelUrl) {
        const inferredUrl = `https://${vercelUrl}`;
        console.warn(`SITE_BASE_URL not set, using inferred URL: ${inferredUrl}`);
        return inferredUrl;
      }
    }
    throw new Error('SITE_BASE_URL environment variable is missing.');
  }
  
  // In production, only allow HTTPS URLs; in development, allow HTTP or HTTPS
  const isProduction = process.env.NODE_ENV === 'production';
  const urlPattern = isProduction ? /^https:\/\/.+/i : /^https?:\/\/.+/i;
  
  if (!urlPattern.test(siteBaseUrl)) {
    throw new Error(
      isProduction
        ? 'SITE_BASE_URL environment variable is malformed. Must be a valid HTTPS URL in production.'
        : 'SITE_BASE_URL environment variable is malformed. Must be a valid HTTP/HTTPS URL.'
    );
  }
  
  // Remove trailing slashes to ensure consistent URL construction
  return siteBaseUrl.replace(/\/+$/, '');
}

/**
 * Constructs a verified email link with proper URL validation
 * 
 * @param token - The verification token to include in the URL
 * @returns The complete verification link URL
 */
export function buildVerificationLink(token: string): string {
  const baseUrl = getValidatedSiteBaseUrl();
  return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
}

/**
 * Constructs a password reset link with proper URL validation
 * 
 * @param token - The password reset token to include in the URL
 * @returns The complete password reset link URL
 */
export function buildPasswordResetLink(token: string): string {
  const baseUrl = getValidatedSiteBaseUrl();
  return `${baseUrl}/update-password?token=${encodeURIComponent(token)}`;
}

