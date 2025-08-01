/**
 * Authentication route constants
 * 
 * Centralized definition of all authentication-related routes where 
 * navigation should be hidden and special auth layouts should be used.
 */

export const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/password-reset',
  '/update-password',
  '/verify-email',
  '/resend-verification'
] as const;

/**
 * Helper function to check if a given pathname is an authentication route
 * 
 * @param pathname - The current pathname to check
 * @returns true if the pathname starts with any auth route
 */
export const isAuthRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
};

/**
 * Type for auth route values
 */
export type AuthRoute = typeof AUTH_ROUTES[number];
