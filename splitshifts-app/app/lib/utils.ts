import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
 * 
 * @throws Error if SITE_BASE_URL is missing or malformed
 * @returns The validated and normalized base URL
 */
export function getValidatedSiteBaseUrl(): string {
  const siteBaseUrl = process.env.SITE_BASE_URL;
  
  if (!siteBaseUrl) {
    throw new Error('SITE_BASE_URL environment variable is missing.');
  }
  
  if (!/^https?:\/\/.+/i.test(siteBaseUrl)) {
    throw new Error('SITE_BASE_URL environment variable is malformed. Must be a valid HTTP/HTTPS URL.');
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

