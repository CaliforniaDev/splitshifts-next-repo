'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';
import { CLOCK_CONSTANTS } from './constants';
import type { ClockDialProps } from './types';
import { getAngle, getPosition, isNumberUnderSelectorContainer } from './utils';

/**
 * ClockDial - Interactive clock face for time selection
 * 
 * Features:
 * - SVG-based clock rendering
 * - Click and drag interaction
 * - Hour and minute modes
 * - Animated show/hide with scale and fade
 * - Visual feedback for selected values
 */
export function ClockDial({
  mode,
  hours,
  minutes,
  showDial,
  justFinishedDrag,
  setHours,
  setMinutes,
  setIsDragging,
  setJustFinishedDrag,
  onHourSelect,
  onMinuteSelect,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onClockInteraction,
  closeInputs,
}: ClockDialProps) {
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesArray = Array.from({ length: 12 }, (_, i) => i * 5);

  const isHourMode = mode === 'hours';
  const currentValue = isHourMode ? hours % 12 : minutes / 5;
  const angle = getAngle(currentValue, 12);
  const pos = getPosition(angle, CLOCK_CONSTANTS.NUMBER_RADIUS);

  return (
    <div
      className={cn(
        'overflow-hidden transition-[max-height] long-ease-emphasized-decelerate',
        showDial ? 'max-h-[292px]' : 'max-h-0',
      )}
    >
      <div className='flex h-[292px] items-center justify-center'>
        <div
          className={cn(
            'relative h-[256px] w-[256px] cursor-pointer select-none rounded-full bg-surface-container-highest',
            'origin-center transition-[opacity,transform] long-ease-emphasized-decelerate',
            showDial
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none scale-75 opacity-0',
          )}
          aria-hidden={!showDial}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onClick={onClockInteraction}
        >
          {/* SVG Clock Face */}
          <svg
            className='pointer-events-none absolute inset-0'
            viewBox={`0 0 ${CLOCK_CONSTANTS.DIAMETER} ${CLOCK_CONSTANTS.DIAMETER}`}
          >
            {/* Center dot */}
            <circle
              cx={CLOCK_CONSTANTS.CENTER}
              cy={CLOCK_CONSTANTS.CENTER}
              r={CLOCK_CONSTANTS.DIAL_SELECTOR_CENTER_RADIUS}
              fill='currentColor'
              className='text-primary'
            />

            {/* Selector track */}
            <line
              x1={CLOCK_CONSTANTS.CENTER}
              y1={CLOCK_CONSTANTS.CENTER}
              x2={pos.x}
              y2={pos.y}
              stroke='currentColor'
              strokeWidth={CLOCK_CONSTANTS.SELECTOR_TRACK_THICKNESS}
              className='text-primary'
            />

            {/* Selector container (end circle) */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={CLOCK_CONSTANTS.DIAL_SELECTOR_CONTAINER_RADIUS}
              fill='currentColor'
              className='text-primary'
            />
          </svg>

          {/* Clock Numbers */}
          {(isHourMode ? hoursArray : minutesArray).map(value => {
            const numberAngle = getAngle(
              isHourMode ? value % 12 : value / 5,
              12,
            );
            const numberPos = getPosition(
              numberAngle,
              CLOCK_CONSTANTS.NUMBER_RADIUS,
            );
            const isUnderSelector = isNumberUnderSelectorContainer(
              value,
              isHourMode,
              hours,
              minutes,
            );

            const handleNumberMouseDown = (e: React.MouseEvent) => {
              e.stopPropagation();
              e.preventDefault();

              // Exit input editing mode
              closeInputs();

              // Set dragging state
              setJustFinishedDrag(false);
              setIsDragging(true);

              // Calculate position from mouse for precise dragging
              const target = e.currentTarget.parentElement;
              if (target) {
                const rect = target.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const x = e.clientX - rect.left - centerX;
                const y = e.clientY - rect.top - centerY;
                let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
                if (angle < 0) angle += 360;

                if (isHourMode) {
                  const calculatedHour = Math.round((angle / 360) * 12) || 12;
                  setHours(calculatedHour);
                } else {
                  const calculatedMinute = Math.floor((angle / 360) * 60) % 60;
                  setMinutes(calculatedMinute);
                }
              }
            };

            const handleNumberClick = (e: React.MouseEvent) => {
              e.stopPropagation();

              // Exit input editing mode
              closeInputs();

              // Only handle direct clicks, not drag-end clicks
              if (!justFinishedDrag) {
                if (isHourMode) {
                  onHourSelect(value);
                } else {
                  onMinuteSelect(value);
                }
              }
            };

            return (
              <button
                key={`${mode}-${value}`}
                tabIndex={-1}
                onMouseDown={handleNumberMouseDown}
                onClick={handleNumberClick}
                className={cn(
                  'typescale-body-large absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2',
                  'items-center justify-center rounded-full transition-colors duration-200',
                  isUnderSelector ? 'text-on-primary' : 'text-on-surface',
                )}
                style={{ left: numberPos.x, top: numberPos.y }}
              >
                {isHourMode ? value : String(value).padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
