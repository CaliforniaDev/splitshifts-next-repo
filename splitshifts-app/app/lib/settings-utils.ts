/**
 * Settings page utilities
 * Shared helpers for settings-related functionality across components
 */

export const settingsPaths = {
  '/settings': 'Settings',
  '/settings/account': 'Account',
  '/settings/change-password': 'Change Password',
  '/settings/security': 'Security'
} as const;

/**
 * Generate a human-readable page title from pathname
 * First checks predefined paths, then generates from pathname as fallback
 * 
 * @param pathname - The current pathname (e.g., "/settings/two-factor-auth")
 * @returns Human-readable title (e.g., "Two Factor Auth")
 */
export const getPageTitle = (pathname: string): string => {
  // Try to get title from predefined paths first
  const predefinedTitle = settingsPaths[pathname as keyof typeof settingsPaths];
  if (predefinedTitle) return predefinedTitle;
  
  // Generate title from pathname as fallback
  const pageName = pathname.split('/').pop() || '';
  
  // Regex patterns for text transformation
  const hyphensPattern = /-/g;           // Replace all hyphens with spaces
  const wordBoundariesPattern = /\b\w/g; // Match first letter of each word for capitalization
  
  return pageName
    .replace(hyphensPattern, ' ')
    .replace(wordBoundariesPattern, letter => letter.toUpperCase()) || 'Settings';
};
