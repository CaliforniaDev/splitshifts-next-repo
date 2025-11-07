'use client';

import { useEffect } from 'react';

/**
 * HydrationProvider - Marks the document as hydrated when React is ready
 * 
 * This prevents users from clicking interactive elements before event listeners
 * are attached, which can lead to confusion when clicks appear to do nothing.
 * 
 * Works in conjunction with CSS rules in globals.css that disable pointer-events
 * on interactive elements until the '.hydrated' class is added to the body.
 */
export function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mark body as hydrated once React has taken over
    document.body.classList.add('hydrated');
  }, []);

  return <>{children}</>;
}
