'use client';

import { ReactNode } from 'react';

interface AnimatedTransitionProps {
  children: ReactNode;
  /**
   * Unique key to force remount and trigger animation on state changes
   */
  animationKey: string;
  /**
   * Animation variant - defaults to fade-slide-up
   */
  variant?: 'fade-slide-up' | 'fade-only' | 'slide-up-only';
  /**
   * Animation duration in milliseconds - defaults to 500ms
   */
  duration?: 300 | 500 | 700 | 1000;
  /**
   * Animation delay in milliseconds - useful for staggered animations
   */
  delay?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AnimatedTransition Component
 * 
 * A reusable component for consistent fade-in animations across auth forms.
 * Automatically handles state transitions with proper remounting via keys.
 * 
 * @example
 * ```tsx
 * <AnimatedTransition animationKey="success">
 *   <SuccessCard />
 * </AnimatedTransition>
 * ```
 */
export default function AnimatedTransition({
  children,
  animationKey,
  variant = 'fade-slide-up',
  duration = 500,
  delay = 0,
  className = '',
}: AnimatedTransitionProps) {
  const getAnimationClasses = () => {
    const baseClasses = 'animate-in';
    
    const variantClasses = {
      'fade-slide-up': 'fade-in-0 slide-in-from-bottom-4',
      'fade-only': 'fade-in-0',
      'slide-up-only': 'slide-in-from-bottom-4',
    };

    const durationClass = `duration-${duration}`;
    const delayClass = delay > 0 ? `delay-${delay}` : '';

    return [
      baseClasses,
      variantClasses[variant],
      durationClass,
      delayClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div key={animationKey} className={getAnimationClasses()}>
      {children}
    </div>
  );
}
