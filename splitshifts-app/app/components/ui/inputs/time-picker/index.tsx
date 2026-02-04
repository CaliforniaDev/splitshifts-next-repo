'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/app/lib/utils';
import {
  type Period,
  initializeTimeState,
  formatTime as formatTimeUtil,
  validateHours,
  validateMinutes,
  createDateFromTime,
} from '@/app/lib/utils/time';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/inputs';
import { Button, IconButton } from '@/app/components/ui/buttons';
import { KeyboardIcon, ClockIcon } from '@/app/components/ui/icons';

import type { TimePickerProps, TimeMode } from './types';
import { DESKTOP_BREAKPOINT } from './constants';
import { TimeSelector } from './time-selector';
import { PeriodSelector } from './period-selector';
import { ClockDial } from './clock-dial';
import { useManualInput } from './use-manual-input';
import { useClockInteraction } from './use-clock-interaction';

/**
 * TimePicker - Complete time input component with dial and keyboard modes
 * 
 * Features:
 * - Dial mode: Interactive clock face with click/drag
 * - Keyboard mode: Direct numeric input
 * - Manual input: Click-to-edit segmented input (HH:MM AM)
 * - Responsive: Defaults to keyboard on desktop, dial on mobile
 * - Material Design 3 styling with animations
 * 
 * @example
 * ```tsx
 * <TimePicker
 *   label="Meeting Time"
 *   value={selectedTime}
 *   onChange={setSelectedTime}
 * />
 * ```
 */
export default function TimePicker({
  label,
  value,
  onChange,
  onBlur,
  error = false,
  errorMessage = '',
  supportingText = '',
  disabled = false,
  required = false,
  className = '',
  iconPosition = 'start',
}: TimePickerProps) {
  // Dialog and mode state
  const [isOpen, setIsOpen] = useState(false);
  const [showDial, setShowDial] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia(DESKTOP_BREAKPOINT).matches;
  });
  const [mode, setMode] = useState<TimeMode>('hours');

  // Time state
  const initialState = initializeTimeState(value ?? null);
  const [hours, setHours] = useState(initialState.hours);
  const [minutes, setMinutes] = useState(initialState.minutes);
  const [period, setPeriod] = useState<Period>(initialState.period);

  // TimeSelector editing state
  const [editingHours, setEditingHours] = useState(false);
  const [editingMinutes, setEditingMinutes] = useState(false);
  const [tempHoursValue, setTempHoursValue] = useState('');
  const [tempMinutesValue, setTempMinutesValue] = useState('');
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);

  // Helper function to close any open inputs
  const closeInputs = () => {
    if (editingHours && hoursInputRef.current) {
      hoursInputRef.current.blur();
    }
    if (editingMinutes && minutesInputRef.current) {
      minutesInputRef.current.blur();
    }
    setEditingHours(false);
    setEditingMinutes(false);
  };

  // Responsive dial mode
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    const handler = (e: MediaQueryListEvent) => setShowDial(!e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Manual input hook
  const manualInput = useManualInput({
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
  });

  // Clock interaction hook
  const clockInteraction = useClockInteraction({
    mode,
    hours,
    minutes,
    setHours,
    setMinutes,
    setMode,
    closeInputs,
  });

  // TimeSelector handlers
  const handleHoursClick = () => {
    setEditingHours(true);
    setTempHoursValue('');
    setMode('hours');
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setTempHoursValue(value);
      if (value.length === 2) {
        setTimeout(() => {
          commitHoursValue();
          setEditingMinutes(true);
          setTempMinutesValue('');
          setMode('minutes');
        }, 0);
      }
    }
  };

  const commitHoursValue = (rawValue?: string) => {
    const nextValue = rawValue ?? hoursInputRef.current?.value ?? tempHoursValue;
    if (nextValue !== '') {
      setHours(validateHours(nextValue));
    }
    setEditingHours(false);
    setTempHoursValue('');
  };

  const handleHoursBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    commitHoursValue(e?.currentTarget.value);
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      commitHoursValue();
      setEditingMinutes(true);
      setTempMinutesValue('');
      setMode('minutes');
    }
  };

  const handleMinutesClick = () => {
    setEditingMinutes(true);
    setTempMinutesValue('');
    setMode('minutes');
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setTempMinutesValue(value);
      if (value.length === 2) {
        commitMinutesValue(value);
        minutesInputRef.current?.blur();
      }
    }
  };

  const commitMinutesValue = (rawValue?: string) => {
    const nextValue = rawValue ?? minutesInputRef.current?.value ?? tempMinutesValue;
    if (nextValue !== '') {
      setMinutes(validateMinutes(nextValue));
    }
    setEditingMinutes(false);
    setTempMinutesValue('');
  };

  const handleMinutesBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    commitMinutesValue(e?.currentTarget.value);
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const resolvedValue = minutesInputRef.current?.value ?? tempMinutesValue;
      const confirmedMinutes =
        resolvedValue === '' ? minutes : validateMinutes(resolvedValue);
      commitMinutesValue(resolvedValue);
      handleConfirm({ minutes: confirmedMinutes });
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      commitMinutesValue();
    }
  };

  const handleConfirm = (override?: { hours?: number; minutes?: number; period?: Period }) => {
    const date = createDateFromTime(
      override?.hours ?? hours,
      override?.minutes ?? minutes,
      override?.period ?? period,
    );
    onChange?.(date);
    setIsOpen(false);
    onBlur?.();
  };

  const handleCancel = () => {
    if (value) {
      const { hours: hrs, minutes: mins, period: per } = initializeTimeState(value);
      setHours(hrs);
      setMinutes(mins);
      setPeriod(per);
    }
    setMode('hours');
    setIsOpen(false);
  };

  const handleOpenPicker = () => {
    if (disabled) return;

    if (manualInput.isManualEditing) {
      manualInput.finalize();
    }

    if (value) {
      const { hours: hrs, minutes: mins, period: per } = initializeTimeState(value);
      setHours(hrs);
      setMinutes(mins);
      setPeriod(per);
    }

    setMode('hours');
    setEditingHours(false);
    setEditingMinutes(false);
    const isDesktop = window.matchMedia(DESKTOP_BREAKPOINT).matches;
    setShowDial(!isDesktop);
    setIsOpen(true);
  };

  const toggleDialMode = () => {
    setShowDial(prev => !prev);
    if (editingHours) {
      commitHoursValue();
      setEditingHours(false);
    }
    if (editingMinutes) {
      commitMinutesValue();
      setEditingMinutes(false);
    }
  };

  const formatTime = () => {
    if (!value) return '';
    return formatTimeUtil(hours, minutes, period);
  };

  const handleClockMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    closeInputs();
    clockInteraction.handleMouseDown(e);
  };

  return (
    <>
      <Input
        label={label}
        type='text'
        icon={<ClockIcon variant='outline' className='h-6' />}
        iconPosition={iconPosition}
        onIconClick={handleOpenPicker}
        iconButtonAriaLabel='Open time picker'
        value={manualInput.isManualEditing ? manualInput.displayValue : formatTime()}
        onFocus={manualInput.handlers.onFocus}
        onClick={manualInput.handlers.onClick}
        onChange={manualInput.handlers.onChange}
        onKeyDown={manualInput.handlers.onKeyDown}
        onBlur={manualInput.handlers.onBlur}
        error={error}
        errorMessage={errorMessage}
        supportingText={supportingText}
        disabled={disabled}
        required={required}
        placeholder='HH:MM AM'
        className={className}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            'w-[328px] gap-5 border-none p-6 shadow-elevation-3',
            'overflow-hidden transition-[max-height] long-ease-emphasized-decelerate',
            showDial ? 'max-h-[524px]' : 'max-h-[268px]',
          )}
        >
          <DialogHeader>
            <DialogTitle className='typescale-label-medium text-on-surface-variant'>
              Select time
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-col'>
            {/* Time Display Header */}
            <div className='flex h-20 items-stretch gap-3'>
              <div className='flex items-center'>
                <TimeSelector
                  value={hours}
                  isActive={mode === 'hours'}
                  isEditing={editingHours}
                  tempValue={tempHoursValue}
                  onEdit={handleHoursClick}
                  onChange={handleHoursChange}
                  onBlur={handleHoursBlur}
                  onKeyDown={handleHoursKeyDown}
                  inputRef={hoursInputRef}
                  rippleKeyframeName='TimeSelectorHours'
                />

                <span className='typescale-display-large w-6 -translate-y-1 text-center !font-normal text-on-surface'>
                  :
                </span>

                <TimeSelector
                  value={minutes}
                  isActive={mode === 'minutes'}
                  isEditing={editingMinutes}
                  tempValue={tempMinutesValue}
                  onEdit={handleMinutesClick}
                  onChange={handleMinutesChange}
                  onBlur={handleMinutesBlur}
                  onKeyDown={handleMinutesKeyDown}
                  inputRef={minutesInputRef}
                  rippleKeyframeName='TimeSelectorMinutes'
                />
              </div>

              <PeriodSelector period={period} onToggle={setPeriod} />
            </div>

            {/* Clock Dial */}
            <ClockDial
              mode={mode}
              hours={hours}
              minutes={minutes}
              showDial={showDial}
              justFinishedDrag={clockInteraction.justFinishedDrag}
              setHours={setHours}
              setMinutes={setMinutes}
              setIsDragging={clockInteraction.setIsDragging}
              setJustFinishedDrag={clockInteraction.setJustFinishedDrag}
              onHourSelect={clockInteraction.handleHourSelect}
              onMinuteSelect={clockInteraction.handleMinuteSelect}
              onMouseDown={clockInteraction.handleMouseDown}
              onMouseMove={clockInteraction.handleMouseMove}
              onMouseUp={clockInteraction.handleMouseUp}
              onClockInteraction={clockInteraction.handleClockInteraction}
              closeInputs={closeInputs}
            />
          </div>

          {/* Actions */}
          <div className='flex h-12 items-center justify-between'>
            <IconButton
              size='small'
              variant='standard'
              aria-label={showDial ? 'Switch to keyboard input' : 'Switch to dial'}
              onClick={toggleDialMode}
              icon={
                <div className='relative h-6 w-6'>
                  <div
                    className={cn(
                      'absolute inset-0 transition-opacity motion-expressive-default',
                      showDial ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <KeyboardIcon className='h-6 w-6' />
                  </div>
                  <div
                    className={cn(
                      'absolute inset-0 transition-opacity motion-expressive-default',
                      showDial ? 'opacity-0' : 'opacity-100',
                    )}
                  >
                    <ClockIcon variant='outline' className='h-6 w-6' />
                  </div>
                </div>
              }
              className='focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
            />

            <div className='flex gap-2'>
              <Button type='button' variant='text' onClick={handleCancel}>
                Cancel
              </Button>
              <Button type='button' variant='text' onClick={() => handleConfirm()}>
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
