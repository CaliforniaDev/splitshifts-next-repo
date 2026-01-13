'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@/app/components/ui/inputs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/buttons';
import { cn } from '@/app/lib/utils';
import {
  useRipple,
  RippleEffect,
  RippleKeyframes,
  RIPPLE_DEFAULTS,
  type RippleConfig,
} from '@/app/lib/utils/ripple';

interface TimePickerProps {
  label: string;
  value?: Date | null;
  onChange?: (newValue: Date | null) => void;
  onBlur?: () => void;
  error?: boolean;
  errorMessage?: string;
  supportingText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

type TimeMode = 'hours' | 'minutes';
type Period = 'AM' | 'PM';

// Clock face constants
const CLOCK_DIAMETER = 256;
const CLOCK_CENTER = CLOCK_DIAMETER / 2; // 128
const DIAL_SELECTOR_CENTER_RADIUS = 4; // 8px diameter
const DIAL_SELECTOR_CONTAINER_RADIUS = 24; // 48px diameter - the circle at end of track
const NUMBER_BUTTON_SIZE = 48;
const EDGE_GAP = 2;
const SELECTOR_TRACK_THICKNESS = 2;

// Calculate number position: dial radius - button half-width - gap
const NUMBER_RADIUS = CLOCK_CENTER - NUMBER_BUTTON_SIZE / 2 - EDGE_GAP; // 102px

// Animation constants
const TRANSITION_TO_MINUTES_DURATION = 250;
const TRANSITION_STEPS = 20;
const TRANSITION_DELAY = 50; // Delay before starting transition animation
const DRAG_BLOCK_DURATION = 100;

// Time Selector Component (editable hours/minutes display)
interface TimeSelectorProps {
  value: number;
  isActive: boolean;
  isEditing: boolean;
  tempValue: string;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  rippleKeyframeName: string;
}

function TimeSelector({
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

  const { ripples, rippleRef, handleMouseDown, handleMouseUp, removeRipple } =
    useRipple(rippleConfig);

  useEffect(() => {
    if (!isEditing) return;
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, inputRef]);

  const handleFocus = () => {
    if (!isEditing) {
      onEdit();
    }
  };

  const handleKeyDownInternal = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
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
      onKeyDown={!isEditing ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      } : undefined}
      tabIndex={!isEditing ? 0 : -1}
      className={cn(
        'typescale-display-large h-20 w-24 rounded-lg !font-normal transition-colors overflow-hidden relative outline-none before:absolute before:inset-0 before:transition-all before:duration-200 before:opacity-0 before:bg-current before:z-[1]',
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
          'typescale-display-large h-20 w-24 rounded-lg bg-transparent text-center !font-normal outline-none relative z-[2]',
          isEditing ? 'caret-primary cursor-text' : 'caret-transparent cursor-pointer',
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

// Period Selector Component (AM/PM toggle)
interface PeriodSelectorProps {
  period: Period;
  onToggle: (period: Period) => void;
}

function PeriodSelector({ period, onToggle }: PeriodSelectorProps) {
  const rippleConfigAM: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: false,
  };

  const rippleConfigPM: RippleConfig = {
    color: 'currentColor',
    opacity: 0.1,
    disabled: false,
  };

  const mergedConfigAM: Required<RippleConfig> = {
    ...RIPPLE_DEFAULTS,
    ...rippleConfigAM,
  };

  const mergedConfigPM: Required<RippleConfig> = {
    ...RIPPLE_DEFAULTS,
    ...rippleConfigPM,
  };

  const {
    ripples: ripplesAM,
    rippleRef: rippleRefAM,
    handleMouseDown: handleMouseDownAM,
    handleMouseUp: handleMouseUpAM,
    removeRipple: removeRippleAM,
  } = useRipple(rippleConfigAM);

  const {
    ripples: ripplesPM,
    rippleRef: rippleRefPM,
    handleMouseDown: handleMouseDownPM,
    handleMouseUp: handleMouseUpPM,
    removeRipple: removeRipplePM,
  } = useRipple(rippleConfigPM);

  return (
    <div className='w-[52px] flex flex-col rounded-lg border border-outline'>
      {/* Period Selector - AM */}
      <button
        ref={rippleRefAM as React.RefObject<HTMLButtonElement>}
        onClick={() => onToggle('AM')}
        onMouseDown={handleMouseDownAM}
        onMouseUp={handleMouseUpAM}
        onMouseLeave={handleMouseUpAM}
        className={cn(
          'flex-1 px-3 text-sm font-medium transition-colors ease-emphasized-decelerate rounded-t-lg outline-none relative overflow-hidden before:absolute before:inset-0 before:transition-all before:duration-200 before:opacity-0 hover:before:opacity-8 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-secondary focus-visible:outline-offset-2 focus-visible:z-10',
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
            config={mergedConfigAM}
            keyframeName='PeriodSelectorAM'
            onComplete={() => removeRippleAM(ripple.id)}
          />
        ))}

        <RippleKeyframes name='PeriodSelectorAM' config={mergedConfigAM} />
      </button>
      {/* Dividing line */}
      <div className='h-px bg-outline' />
      {/* Period Selector - PM */}
      <button
        ref={rippleRefPM as React.RefObject<HTMLButtonElement>}
        onClick={() => onToggle('PM')}
        onMouseDown={handleMouseDownPM}
        onMouseUp={handleMouseUpPM}
        onMouseLeave={handleMouseUpPM}
        className={cn(
          'flex-1 px-3 text-sm font-medium transition-colors ease-emphasized-decelerate rounded-b-lg outline-none relative overflow-hidden before:absolute before:inset-0 before:transition-all before:duration-200 before:opacity-0 hover:before:opacity-8 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-secondary focus-visible:outline-offset-2 focus-visible:z-10',
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
            config={mergedConfigPM}
            keyframeName='PeriodSelectorPM'
            onComplete={() => removeRipplePM(ripple.id)}
          />
        ))}

        <RippleKeyframes name='PeriodSelectorPM' config={mergedConfigPM} />
      </button>
    </div>
  );
}

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
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TimeMode>('hours');
  const [hours, setHours] = useState(() => {
    if (value) {
      const hrs = value.getHours();
      return hrs === 0 ? 12 : hrs > 12 ? hrs - 12 : hrs;
    }
    return 12;
  });
  const [minutes, setMinutes] = useState(() => {
    if (value) return value.getMinutes();
    return 0;
  });
  const [period, setPeriod] = useState<Period>(() => {
    if (value) {
      const hrs = value.getHours();
      return hrs >= 12 ? 'PM' : 'AM';
    }
    return 'AM';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [justFinishedDrag, setJustFinishedDrag] = useState(false);
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
    setTempHoursValue('');
    setTempMinutesValue('');
  };

  // Format time for display in input field
  const formatTime = () => {
    if (!value) return '';
    const hrs = String(hours).padStart(2, '0');
    const mins = String(minutes).padStart(2, '0');
    return `${hrs}:${mins} ${period}`;
  };

  // Calculate angle for clock hand position (0° = 12 o'clock, 90° = 3 o'clock)
  const getAngle = (value: number, total: number) => {
    return (value * 360) / total - 90;
  };

  // Convert angle and radius to x,y coordinates on clock face
  const getPosition = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius + CLOCK_CENTER,
      y: Math.sin(radian) * radius + CLOCK_CENTER,
    };
  };

  // Cubic bezier easing function for emphasized decelerate
  // Control points: (0.05, 0.7) and (0.1, 1)
  const emphasizedDecelerate = (t: number): number => {
    // Cubic bezier with control points P1(0.05, 0.7) and P2(0.1, 1)
    const cx = 3 * 0.05;
    const bx = 3 * (0.1 - 0.05) - cx;
    const ax = 1 - cx - bx;

    const cy = 3 * 0.7;
    const by = 3 * (1 - 0.7) - cy;
    const ay = 1 - cy - by;

    // Calculate bezier curve value
    const t2 = t * t;
    const t3 = t2 * t;

    return ay * t3 + by * t2 + cy * t;
  };

  // Handle hours input editing
  const handleHoursClick = () => {
    setEditingHours(true);
    setTempHoursValue('');
    setMode('hours');
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 2) {
      setTempHoursValue(value);

      // Auto-advance to minutes after 2 digits
      if (value.length === 2) {
        setTimeout(() => {
          handleHoursBlur();
          setEditingMinutes(true);
          setTempMinutesValue('');
          setMode('minutes');
        }, 0);
      }
    }
  };

  const handleHoursBlur = () => {
    if (tempHoursValue === '') {
      // User didn't type anything, keep current value
      setEditingHours(false);
      return;
    }

    let numValue = parseInt(tempHoursValue, 10);

    // Validate hours (1-12)
    if (isNaN(numValue) || numValue < 1) {
      numValue = 1;
    } else if (numValue > 12) {
      numValue = 12;
    }

    setHours(numValue);
    setEditingHours(false);
    setTempHoursValue('');
  };

  const handleHoursKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleHoursBlur();
      setEditingMinutes(true);
      setTempMinutesValue('');
      setMode('minutes');
    }
  };

  // Handle minutes input editing
  const handleMinutesClick = () => {
    setEditingMinutes(true);
    setTempMinutesValue('');
    setMode('minutes');
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 2) {
      setTempMinutesValue(value);

      // Auto-complete after 2 digits
      if (value.length === 2) {
        // Use the current value directly to avoid state timing issues
        let numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 0) {
          numValue = 0;
        } else if (numValue > 59) {
          numValue = 59;
        }
        setMinutes(numValue);
        setEditingMinutes(false);
        setTempMinutesValue('');
      }
    }
  };

  const handleMinutesBlur = () => {
    if (tempMinutesValue === '') {
      // User didn't type anything, keep current value
      setEditingMinutes(false);
      return;
    }

    let numValue = parseInt(tempMinutesValue, 10);

    // Validate minutes (0-59)
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    } else if (numValue > 59) {
      numValue = 59;
    }

    setMinutes(numValue);
    setEditingMinutes(false);
    setTempMinutesValue('');
  };

  const handleMinutesKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleMinutesBlur();
    }
  };

  // Handle hour selection and transition to minutes mode
  const handleHourSelect = (hour: number) => {
    setHours(hour);

    // Start at the corresponding minute position for smooth visual transition
    const startMinute = (hour % 12) * 5;
    setMinutes(startMinute);
    setMode('minutes');

    // Animate hand from current position to 30-minute mark
    setTimeout(() => {
      const targetMinute = 30;
      const stepDuration = TRANSITION_TO_MINUTES_DURATION / TRANSITION_STEPS;
      let currentStep = 0;

      const animationInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / TRANSITION_STEPS;

        // Emphasized decelerate easing for smooth, natural motion
        const easedProgress = emphasizedDecelerate(progress);

        // Calculate shortest path around clock
        let diff = targetMinute - startMinute;
        if (diff > 30) diff -= 60;
        if (diff < -30) diff += 60;

        const currentMinute = Math.round(startMinute + diff * easedProgress);
        setMinutes(currentMinute >= 0 ? currentMinute : currentMinute + 60);

        if (currentStep >= TRANSITION_STEPS) {
          clearInterval(animationInterval);
          setMinutes(targetMinute);
        }
      }, stepDuration);
    }, TRANSITION_DELAY);
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    setMinutes(minute);
  };

  // Handle clock face interaction (click or drag)
  const handleClockInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // Calculate angle from center (0° = top, 90° = right)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hours') {
      // Convert angle to hour value (1-12)
      const hour = Math.round((angle / 360) * 12) || 12;
      setHours(hour);
    } else {
      // Convert angle to minute value (0-59)
      // Using floor for stable dragging behavior
      const minute = Math.floor((angle / 360) * 60) % 60;
      setMinutes(minute);
    }
  };

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Exit input editing mode and blur inputs when interacting with dial
    closeInputs();

    setJustFinishedDrag(false);
    setIsDragging(true);
    handleClockInteraction(e);
  };

  // Continue dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    handleClockInteraction(e);
  };

  // Stop dragging
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      setJustFinishedDrag(true);
      setTimeout(() => setJustFinishedDrag(false), DRAG_BLOCK_DURATION);

      // Auto-transition to minutes after dragging in hours mode
      if (mode === 'hours') {
        handleHourSelect(hours);
      }
    }
    setIsDragging(false);
  };

  // Toggle between AM/PM
  const handlePeriodToggle = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };

  // Confirm time selection and close dialog
  const handleConfirm = () => {
    const date = new Date();
    let hrs = hours;

    // Convert 12-hour to 24-hour format
    if (period === 'PM' && hrs !== 12) hrs += 12;
    if (period === 'AM' && hrs === 12) hrs = 0;

    date.setHours(hrs, minutes, 0, 0);
    onChange?.(date);
    setIsOpen(false);
    onBlur?.();
  };

  // Cancel and reset to original value
  const handleCancel = () => {
    if (value) {
      const hrs = value.getHours();
      const mins = value.getMinutes();
      setHours(hrs === 0 ? 12 : hrs > 12 ? hrs - 12 : hrs);
      setMinutes(mins);
      setPeriod(hrs >= 12 ? 'PM' : 'AM');
    }
    setMode('hours');
    setIsOpen(false);
  };

  // Generate hour/minute arrays
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutesArray = Array.from({ length: 12 }, (_, i) => i * 5);

  // Check if a number is under the dial selector container (for color change to text-on-primary)
  const isNumberUnderSelectorContainer = (
    numberValue: number,
    isHourMode: boolean,
  ) => {
    if (isHourMode) {
      return numberValue % 12 === hours % 12;
    } else {
      // For minutes, check if the minute value is close to the current selection
      const selectedAngle = (minutes / 60) * 360;
      const numberAngle = (numberValue / 60) * 360;
      const angleDiff = Math.abs(selectedAngle - numberAngle);
      return angleDiff < 15 || angleDiff > 345; // Within ~15 degrees
    }
  };

  return (
    <>
      <Input
        label={label}
        type='text'
        value={formatTime()}
        onClick={() => {
          if (!disabled) {
            // Sync state when opening
            if (value) {
              const hrs = value.getHours();
              const mins = value.getMinutes();
              setHours(hrs === 0 ? 12 : hrs > 12 ? hrs - 12 : hrs);
              setMinutes(mins);
              setPeriod(hrs >= 12 ? 'PM' : 'AM');
            }
            setMode('hours'); // Always start with hours mode
            setEditingHours(false); // Start with hours focused but not editing
            setEditingMinutes(false);
            setIsOpen(true);
          }
        }}
        onBlur={onBlur}
        error={error}
        errorMessage={errorMessage}
        supportingText={supportingText}
        disabled={disabled}
        required={required}
        readOnly
        className={cn('cursor-pointer', className)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='p-6 w-fit border-none'>
          <DialogHeader>
            <DialogTitle className='typescale-label-medium text-on-surface-variant'>
              Select time
            </DialogTitle>
          </DialogHeader>

          <div className='flex flex-col mt-5'>
            {/* Time Display Header - 80px wrapper */}
            <div className='flex h-20 items-stretch gap-3'>
              {/* Time Selectors */}
              <div className='flex items-center'>
                {/* Time Selector - Hours */}
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

                {/* Time Selector Separator - 24px gap */}
                <span className='typescale-display-large !font-normal text-on-surface w-6 text-center -translate-y-1'>
                  :
                </span>

                {/* Time Selector - Minutes */}
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

              {/* Period Selector Container */}
              <PeriodSelector period={period} onToggle={handlePeriodToggle} />
            </div>

            {/* Clock Face */}
            <div
              className='relative mx-auto h-[256px] w-[256px] cursor-pointer select-none rounded-full bg-surface-container-highest mt-9'
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleClockInteraction}
            >
              <svg
                className='pointer-events-none absolute inset-0'
                viewBox={`0 0 ${CLOCK_DIAMETER} ${CLOCK_DIAMETER}`}
              >
                {/* Dial selector center */}
                <circle
                  cx={CLOCK_CENTER}
                  cy={CLOCK_CENTER}
                  r={DIAL_SELECTOR_CENTER_RADIUS}
                  fill='currentColor'
                  className='text-primary'
                />

                {/* Hours mode: Dial selector track and container */}
                {mode === 'hours' && (
                  <>
                    {/* Dial selector track */}
                    <line
                      x1={CLOCK_CENTER}
                      y1={CLOCK_CENTER}
                      x2={
                        getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).x
                      }
                      y2={
                        getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).y
                      }
                      stroke='currentColor'
                      strokeWidth={SELECTOR_TRACK_THICKNESS}
                      className='text-primary'
                    />
                    {/* Dial selector container */}
                    <circle
                      cx={
                        getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).x
                      }
                      cy={
                        getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).y
                      }
                      r={DIAL_SELECTOR_CONTAINER_RADIUS}
                      fill='currentColor'
                      className='text-primary'
                    />
                  </>
                )}

                {/* Minutes mode: Dial selector track and container */}
                {mode === 'minutes' && (
                  <>
                    {/* Dial selector track */}
                    <line
                      x1={CLOCK_CENTER}
                      y1={CLOCK_CENTER}
                      x2={
                        getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).x
                      }
                      y2={
                        getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).y
                      }
                      stroke='currentColor'
                      strokeWidth={SELECTOR_TRACK_THICKNESS}
                      className='text-primary'
                    />
                    {/* Dial selector container */}
                    <circle
                      cx={
                        getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).x
                      }
                      cy={
                        getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).y
                      }
                      r={DIAL_SELECTOR_CONTAINER_RADIUS}
                      fill='currentColor'
                      className='text-primary'
                    />
                  </>
                )}
              </svg>

              {/* Hour numbers */}
              {mode === 'hours' &&
                hoursArray.map(hour => {
                  const angle = getAngle(hour % 12, 12);
                  const pos = getPosition(angle, NUMBER_RADIUS);
                  const isUnderSelectorContainer =
                    isNumberUnderSelectorContainer(hour, true);
                  return (
                    <button
                      key={hour}
                      onMouseDown={e => {
                        e.stopPropagation();
                        e.preventDefault();

                        // Exit input editing mode
                        closeInputs();

                        setJustFinishedDrag(false);
                        setIsDragging(true);
                        const target = e.currentTarget.parentElement;
                        if (target) {
                          const rect = target.getBoundingClientRect();
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          const x = e.clientX - rect.left - centerX;
                          const y = e.clientY - rect.top - centerY;
                          let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
                          if (angle < 0) angle += 360;
                          const calculatedHour =
                            Math.round((angle / 360) * 12) || 12;
                          setHours(calculatedHour);
                        }
                      }}
                      onClick={e => {
                        e.stopPropagation();

                        // Exit input editing mode
                        closeInputs();

                        if (!justFinishedDrag) {
                          handleHourSelect(hour);
                        }
                      }}
                      className={cn(
                        'typescale-body-large absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200',
                        isUnderSelectorContainer
                          ? 'text-on-primary'
                          : 'text-on-surface',
                      )}
                      style={{ left: pos.x, top: pos.y }}
                    >
                      {hour}
                    </button>
                  );
                })}

              {/* Minute numbers */}
              {mode === 'minutes' &&
                minutesArray.map(minute => {
                  const angle = getAngle(minute / 5, 12);
                  const pos = getPosition(angle, NUMBER_RADIUS);
                  const isUnderSelectorContainer =
                    isNumberUnderSelectorContainer(minute, false);
                  return (
                    <button
                      key={minute}
                      onMouseDown={e => {
                        e.stopPropagation();
                        e.preventDefault();

                        // Exit input editing mode
                        closeInputs();

                        setJustFinishedDrag(false);
                        setIsDragging(true);
                        const target = e.currentTarget.parentElement;
                        if (target) {
                          const rect = target.getBoundingClientRect();
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          const x = e.clientX - rect.left - centerX;
                          const y = e.clientY - rect.top - centerY;
                          let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
                          if (angle < 0) angle += 360;
                          const calculatedMinute =
                            Math.floor((angle / 360) * 60) % 60;
                          setMinutes(calculatedMinute);
                        }
                      }}
                      onClick={e => {
                        e.stopPropagation();

                        // Exit input editing mode
                        closeInputs();

                        if (!justFinishedDrag) {
                          handleMinuteSelect(minute);
                        }
                      }}
                      className={cn(
                        'typescale-body-large absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200',
                        isUnderSelectorContainer
                          ? 'text-on-primary'
                          : 'text-on-surface',
                      )}
                      style={{ left: pos.x, top: pos.y }}
                    >
                      {String(minute).padStart(2, '0')}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Keyboard Icon - Bottom Left Corner */}
          <button
            type='button'
            className='absolute bottom-6 left-6 flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant outline-none overflow-hidden before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-200 before:opacity-0 hover:before:opacity-8 focus:before:opacity-12 before:bg-current'
            aria-label='Toggle keyboard input'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='h-6 w-6'
            >
              <path
                fillRule='evenodd'
                d='M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h5.25a.75.75 0 0 0 0-1.5H10.5Z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          <DialogFooter className='mt-6'>
            <Button type='button' variant='text' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='button' variant='text' onClick={handleConfirm}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
