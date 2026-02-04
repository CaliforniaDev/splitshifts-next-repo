'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ANIMATION_CONSTANTS } from './constants';
import { calculateAngleFromMouse, angleToHour, angleToMinute, emphasizedDecelerate } from './utils';
import type { TimeMode } from './types';

interface UseClockInteractionProps {
  mode: TimeMode;
  hours: number;
  minutes: number;
  setHours: (h: number) => void;
  setMinutes: (m: number) => void;
  setMode: (m: TimeMode) => void;
  closeInputs: () => void;
}

/**
 * Hook for managing clock dial mouse interactions
 * 
 * Features:
 * - Click and drag handling
 * - Angle calculation from mouse position
 * - Auto-transition from hours to minutes
 * - Animated clock hand movement
 * - Drag state management
 */
export function useClockInteraction({
  mode,
  hours,
  minutes,
  setHours,
  setMinutes,
  setMode,
  closeInputs,
}: UseClockInteractionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [justFinishedDrag, setJustFinishedDrag] = useState(false);

  const modeRef = useRef(mode);
  const hoursRef = useRef(hours);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    hoursRef.current = hours;
  }, [hours]);

  /**
   * Handle hour selection with animated transition to minutes mode
   */
  const handleHourSelect = useCallback(
    (hour: number) => {
      setHours(hour);
      setMode('minutes');

      const startMinute = (hour % 12) * 5;
      setMinutes(startMinute);

      setTimeout(() => {
        const targetMinute = 30;
        const stepDuration =
          ANIMATION_CONSTANTS.TRANSITION_TO_MINUTES_DURATION /
          ANIMATION_CONSTANTS.TRANSITION_STEPS;
        let currentStep = 0;

        const animationInterval = setInterval(() => {
          currentStep++;
          const progress = currentStep / ANIMATION_CONSTANTS.TRANSITION_STEPS;
          const easedProgress = emphasizedDecelerate(progress);

          let diff = targetMinute - startMinute;
          if (diff > 30) diff -= 60;
          if (diff < -30) diff += 60;

          const currentMinute = Math.round(startMinute + diff * easedProgress);
          setMinutes(currentMinute >= 0 ? currentMinute : currentMinute + 60);

          if (currentStep >= ANIMATION_CONSTANTS.TRANSITION_STEPS) {
            clearInterval(animationInterval);
            setMinutes(targetMinute);
          }
        }, stepDuration);
      }, ANIMATION_CONSTANTS.TRANSITION_DELAY);
    },
    [setHours, setMode, setMinutes],
  );

  const handleMinuteSelect = useCallback(
    (minute: number) => {
      setMinutes(minute);
    },
    [setMinutes],
  );

  const handleClockInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const angle = calculateAngleFromMouse(rect, e.clientX, e.clientY);

      if (mode === 'hours') {
        setHours(angleToHour(angle));
      } else {
        setMinutes(angleToMinute(angle));
      }
    },
    [mode, setHours, setMinutes],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      
      // Exit input editing mode when interacting with dial
      closeInputs();
      
      setJustFinishedDrag(false);
      setIsDragging(true);
      handleClockInteraction(e);
    },
    [handleClockInteraction, closeInputs],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();
      handleClockInteraction(e);
    },
    [isDragging, handleClockInteraction],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        setJustFinishedDrag(true);
        setTimeout(
          () => setJustFinishedDrag(false),
          ANIMATION_CONSTANTS.DRAG_BLOCK_DURATION,
        );

        if (mode === 'hours') {
          handleHourSelect(hours);
        }
      }
      setIsDragging(false);
    },
    [isDragging, mode, hours, handleHourSelect],
  );

  // Global mouseup listener for drag completion
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseUp = () => {
      setJustFinishedDrag(true);
      setTimeout(
        () => setJustFinishedDrag(false),
        ANIMATION_CONSTANTS.DRAG_BLOCK_DURATION,
      );

      if (modeRef.current === 'hours') {
        handleHourSelect(hoursRef.current);
      }

      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, handleHourSelect]);

  return {
    isDragging,
    justFinishedDrag,
    setIsDragging,
    setJustFinishedDrag,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClockInteraction,
    handleHourSelect,
    handleMinuteSelect,
  };
}
