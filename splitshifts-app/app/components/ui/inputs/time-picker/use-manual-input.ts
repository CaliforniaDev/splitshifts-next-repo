'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Period, initializeTimeState, formatTime, createDateFromTime } from '@/app/lib/utils/time';

/**
 * Manual input segment ranges in the formatted string "HH:MM AM"
 */
const MANUAL_SEGMENT_RANGES = {
  hours: [0, 2] as [number, number],
  minutes: [3, 5] as [number, number],
  period: [6, 8] as [number, number],
};

type ManualSegment = 'hours' | 'minutes' | 'period';

interface UseManualInputProps {
  value: Date | null | undefined;
  hours: number;
  minutes: number;
  period: Period;
  setHours: (h: number) => void;
  setMinutes: (m: number) => void;
  setPeriod: (p: Period) => void;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
  validateHours: (value: string) => number;
  validateMinutes: (value: string) => number;
}

/**
 * Hook for managing manual input editing with segmented navigation
 * 
 * Features:
 * - Segment-based editing (hours, minutes, period)
 * - Keyboard navigation (arrows, space, colon)
 * - Auto-advance on complete segments
 * - Buffer for multi-digit input
 */
export function useManualInput({
  value,
  hours,
  minutes,
  period,
  setHours,
  setMinutes,
  setPeriod,
  onChange,
  onBlur,
  validateHours,
  validateMinutes,
}: UseManualInputProps) {
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [activeSegment, setActiveSegment] = useState<ManualSegment>('hours');
  const [segmentBuffer, setSegmentBuffer] = useState('');
  const manualInputRef = useRef<HTMLInputElement | null>(null);

  const selectSegment = useCallback((segment: ManualSegment) => {
    const input = manualInputRef.current;
    if (!input) return;
    const [start, end] = MANUAL_SEGMENT_RANGES[segment];
    requestAnimationFrame(() => input.setSelectionRange(start, end));
  }, []);

  const setSegment = useCallback((segment: ManualSegment) => {
    setActiveSegment(segment);
    setSegmentBuffer('');
    selectSegment(segment);
  }, [selectSegment]);

  const advanceSegment = useCallback(() => {
    if (activeSegment === 'hours') {
      setSegment('minutes');
    } else if (activeSegment === 'minutes') {
      setSegment('period');
    }
  }, [activeSegment, setSegment]);

  const retreatSegment = useCallback(() => {
    if (activeSegment === 'period') {
      setSegment('minutes');
    } else if (activeSegment === 'minutes') {
      setSegment('hours');
    }
  }, [activeSegment, setSegment]);

  useEffect(() => {
    if (!isManualEditing) return;
    selectSegment(activeSegment);
  }, [activeSegment, hours, minutes, period, isManualEditing, selectSegment]);

  const finalizeManualEditing = useCallback(() => {
    if (!isManualEditing) return;
    const currentState = value ? initializeTimeState(value) : null;
    const hasChanged =
      !currentState ||
      currentState.hours !== hours ||
      currentState.minutes !== minutes ||
      currentState.period !== period;
    if (hasChanged) {
      const date = createDateFromTime(hours, minutes, period);
      onChange?.(date);
    }
    setIsManualEditing(false);
    setSegmentBuffer('');
  }, [isManualEditing, value, hours, minutes, period, onChange]);

  const handleManualFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    manualInputRef.current = event.currentTarget;
    if (value) {
      const { hours: hrs, minutes: mins, period: per } = initializeTimeState(value);
      setHours(hrs);
      setMinutes(mins);
      setPeriod(per);
    }
    setIsManualEditing(true);
    setSegment('hours');
  }, [value, setHours, setMinutes, setPeriod, setSegment]);

  const handleManualClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    manualInputRef.current = event.currentTarget;
    if (!isManualEditing) {
      setIsManualEditing(true);
    }
    const cursorPosition = event.currentTarget.selectionStart ?? 0;
    if (cursorPosition <= 2) {
      setSegment('hours');
    } else if (cursorPosition <= 5) {
      setSegment('minutes');
    } else {
      setSegment('period');
    }
  }, [isManualEditing, setSegment]);

  const handleManualChange = useCallback(() => {
    // Prevent default input behavior
  }, []);

  const handleManualBlur = useCallback(() => {
    finalizeManualEditing();
    onBlur?.();
  }, [finalizeManualEditing, onBlur]);

  const handleManualKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isManualEditing) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'Tab') return;

    if (event.key === 'Enter') {
      event.preventDefault();
      manualInputRef.current?.blur();
      return;
    }

    if (event.key === 'ArrowRight' || event.key === ':' || event.key === ' ') {
      event.preventDefault();
      advanceSegment();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      retreatSegment();
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      if (segmentBuffer.length > 0) {
        const nextBuffer = segmentBuffer.slice(0, -1);
        setSegmentBuffer(nextBuffer);
        if (activeSegment === 'hours' && nextBuffer) {
          setHours(validateHours(nextBuffer));
        }
        if (activeSegment === 'minutes' && nextBuffer) {
          setMinutes(validateMinutes(nextBuffer));
        }
        return;
      }
      retreatSegment();
      return;
    }

    const lowerKey = event.key.toLowerCase();
    if (lowerKey === 'a' || lowerKey === 'p') {
      event.preventDefault();
      setPeriod(lowerKey === 'a' ? 'AM' : 'PM');
      setSegment('period');
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    if (activeSegment === 'hours') {
      const nextBuffer = `${segmentBuffer}${event.key}`.slice(-2);
      const nextHours = validateHours(nextBuffer);
      setSegmentBuffer(nextBuffer);
      setHours(nextHours);
      const shouldAdvance =
        nextBuffer.length === 2 || (nextBuffer.length === 1 && nextHours > 1);
      if (shouldAdvance) {
        advanceSegment();
      }
      return;
    }

    if (activeSegment === 'minutes') {
      const nextBuffer = `${segmentBuffer}${event.key}`.slice(-2);
      setSegmentBuffer(nextBuffer);
      setMinutes(validateMinutes(nextBuffer));
      if (nextBuffer.length === 2) {
        advanceSegment();
      }
    }
  }, [
    isManualEditing,
    activeSegment,
    segmentBuffer,
    validateHours,
    validateMinutes,
    setHours,
    setMinutes,
    setPeriod,
    advanceSegment,
    retreatSegment,
    setSegment,
  ]);

  const getDisplayValue = () => formatTime(hours, minutes, period);

  return {
    isManualEditing,
    manualInputRef,
    displayValue: getDisplayValue(),
    handlers: {
      onFocus: handleManualFocus,
      onClick: handleManualClick,
      onChange: handleManualChange,
      onBlur: handleManualBlur,
      onKeyDown: handleManualKeyDown,
    },
    finalize: finalizeManualEditing,
  };
}
