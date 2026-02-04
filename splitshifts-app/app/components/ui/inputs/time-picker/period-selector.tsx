'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';
import type { PeriodSelectorProps } from './types';

/**
 * PeriodSelector - AM/PM toggle component
 * 
 * Features:
 * - Material Design ripple effect
 * - Keyboard and mouse support
 * - Visual states for selected/unselected
 * - Hover effects (except on selected)
 */
export function PeriodSelector({ period, onToggle }: PeriodSelectorProps) {
  const rippleConfig: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: false,
  };

  const mergedConfig: Required<RippleConfig> = {
    ...RIPPLE_DEFAULTS,
    ...rippleConfig,
  };

  const {
    ripples: ripplesAM,
    rippleRef: rippleRefAM,
    handleMouseDown: handleMouseDownAM,
    handleMouseUp: handleMouseUpAM,
    handleKeyDown: handleKeyDownAM,
    handleKeyUp: handleKeyUpAM,
    removeRipple: removeRippleAM,
  } = useRipple(rippleConfig);

  const {
    ripples: ripplesPM,
    rippleRef: rippleRefPM,
    handleMouseDown: handleMouseDownPM,
    handleMouseUp: handleMouseUpPM,
    handleKeyDown: handleKeyDownPM,
    handleKeyUp: handleKeyUpPM,
    removeRipple: removeRipplePM,
  } = useRipple(rippleConfig);

  const buttonBaseClasses = cn(
    'relative flex-1 overflow-hidden px-3 text-sm font-medium outline-none transition-colors',
    'before:absolute before:inset-0 before:opacity-0 before:transition-all before:duration-200',
    'hover:before:opacity-8',
    'focus-visible:z-10 focus-visible:outline focus-visible:outline-[3px]',
    'focus-visible:outline-offset-2 focus-visible:outline-secondary',
  );

  return (
    <div className='flex w-[52px] flex-col rounded-lg border border-outline'>
      {/* AM Button */}
      <button
        ref={rippleRefAM as React.RefObject<HTMLButtonElement>}
        onClick={() => onToggle('AM')}
        onMouseDown={handleMouseDownAM}
        onMouseUp={handleMouseUpAM}
        onMouseLeave={handleMouseUpAM}
        onKeyDown={handleKeyDownAM}
        onKeyUp={handleKeyUpAM}
        className={cn(
          buttonBaseClasses,
          'rounded-t-lg',
          period === 'AM'
            ? 'bg-tertiary-container text-on-tertiary-container before:bg-on-tertiary-container'
            : 'bg-surface-container-high text-on-surface-variant before:bg-on-surface-variant',
        )}
      >
        <span className='relative z-10'>AM</span>

        {ripplesAM.map(ripple => (
          <RippleEffect
            key={ripple.id}
            {...ripple}
            config={mergedConfig}
            keyframeName='PeriodSelectorAM'
            onComplete={() => removeRippleAM(ripple.id)}
          />
        ))}

        <RippleKeyframes name='PeriodSelectorAM' config={mergedConfig} />
      </button>

      <div className='h-px bg-outline' />

      {/* PM Button */}
      <button
        ref={rippleRefPM as React.RefObject<HTMLButtonElement>}
        onClick={() => onToggle('PM')}
        onMouseDown={handleMouseDownPM}
        onMouseUp={handleMouseUpPM}
        onMouseLeave={handleMouseUpPM}
        onKeyDown={handleKeyDownPM}
        onKeyUp={handleKeyUpPM}
        className={cn(
          buttonBaseClasses,
          'rounded-b-lg',
          period === 'PM'
            ? 'bg-tertiary-container text-on-tertiary-container before:bg-on-tertiary-container'
            : 'bg-surface-container-high text-on-surface-variant before:bg-on-surface-variant',
        )}
      >
        <span className='relative z-10'>PM</span>

        {ripplesPM.map(ripple => (
          <RippleEffect
            key={ripple.id}
            {...ripple}
            config={mergedConfig}
            keyframeName='PeriodSelectorPM'
            onComplete={() => removeRipplePM(ripple.id)}
          />
        ))}

        <RippleKeyframes name='PeriodSelectorPM' config={mergedConfig} />
      </button>
    </div>
  );
}
