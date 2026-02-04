'use client';

import React, { useEffect } from 'react';
import { cn } from '@/app/lib/utils';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';
import type { TimeSelectorProps } from './types';

/**
 * TimeSelector - Editable hour/minute display component
 * 
 * Features:
 * - Click to edit
 * - Material Design ripple effect
 * - Auto-focus and select on edit
 * - Keyboard support (Enter/Space to activate)
 * - Visual states: active/inactive, editing/viewing
 */
export function TimeSelector({
  value,
  isActive,
  isEditing,
  tempValue,
  onEdit,
  onChange,
  onBlur,
  onKeyDown,
  inputRef,
  rippleKeyframeName,
}: TimeSelectorProps) {
  const rippleConfig: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: isEditing,
  };

  const mergedConfig: Required<RippleConfig> = {
    ...RIPPLE_DEFAULTS,
    ...rippleConfig,
    disabled: isEditing,
  };

  const {
    ripples,
    rippleRef,
    handleMouseDown,
    handleMouseUp,
    handleKeyDown: handleRippleKeyDown,
    handleKeyUp,
    removeRipple,
  } = useRipple(rippleConfig);

  // Auto-focus and select when entering edit mode
  useEffect(() => {
    if (!isEditing) return;
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, inputRef]);

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isEditing) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEdit();
      }
      return;
    }
    onKeyDown(e);
  };

  const handleMouseDownInternal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing) return;
    handleMouseDown(e as React.MouseEvent<HTMLElement>);
  };

  const displayValue = isEditing ? tempValue : String(value).padStart(2, '0');

  return (
    <div
      ref={rippleRef as React.RefObject<HTMLDivElement>}
      onMouseDown={handleMouseDownInternal}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={!isEditing ? onEdit : undefined}
      onKeyDown={
        !isEditing
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleRippleKeyDown(e as unknown as React.KeyboardEvent<HTMLElement>);
              }
            }
          : undefined
      }
      onKeyUp={
        !isEditing
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleKeyUp(e as unknown as React.KeyboardEvent<HTMLElement>);
                onEdit();
              }
            }
          : undefined
      }
      tabIndex={!isEditing ? 0 : -1}
      className={cn(
        'typescale-display-large relative h-20 w-24 overflow-hidden rounded-lg !font-normal outline-none transition-colors',
        'before:absolute before:inset-0 before:z-[1] before:bg-current before:opacity-0 before:transition-all before:duration-200',
        isActive
          ? 'bg-primary-container text-on-primary-container'
          : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface',
        isEditing ? 'cursor-text' : 'cursor-pointer',
        'focus-within:shadow-[inset_0_0_0_3px_#535F70]',
        !isActive && 'hover:before:opacity-8',
      )}
    >
      <input
        ref={inputRef}
        type='text'
        inputMode='numeric'
        value={displayValue}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDownInternal}
        readOnly={!isEditing}
        tabIndex={isEditing ? 0 : -1}
        className={cn(
          'typescale-display-large relative z-[2] h-20 w-24 rounded-lg bg-transparent text-center !font-normal outline-none',
          isEditing
            ? 'cursor-text caret-primary'
            : 'cursor-pointer caret-transparent',
        )}
      />

      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          {...ripple}
          config={mergedConfig}
          keyframeName={rippleKeyframeName}
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}

      <RippleKeyframes name={rippleKeyframeName} config={mergedConfig} />
    </div>
  );
}
