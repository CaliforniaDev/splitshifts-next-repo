'use client';

import { useState } from 'react';
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
  const isNumberUnderSelectorContainer = (numberValue: number, isHourMode: boolean) => {
    if (isHourMode) {
      return (numberValue % 12) === (hours % 12);
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
        type="text"
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
        <DialogContent className="max-w-[320px]">
          <DialogHeader>
            <DialogTitle>Select Time</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 p-2">
            {/* Time Display Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <button
                  onClick={() => setMode('hours')}
                  className={cn(
                    'text-5xl font-normal transition-colors',
                    mode === 'hours'
                      ? 'text-on-primary-container bg-primary-container'
                      : 'text-on-surface-variant hover:text-on-surface'
                  )}
                >
                  {String(hours).padStart(2, '0')}
                </button>
                <span className="text-5xl text-on-surface-variant">:</span>
                <button
                  onClick={() => setMode('minutes')}
                  className={cn(
                    'text-5xl font-normal transition-colors',
                    mode === 'minutes'
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  )}
                >
                  {String(minutes).padStart(2, '0')}
                </button>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handlePeriodToggle('AM')}
                  className={cn(
                    'rounded-lg px-3 py-1 text-sm font-medium transition-colors ease-emphasized-decelerate',
                    period === 'AM'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-highest'
                  )}
                >
                  AM
                </button>
                <button
                  onClick={() => handlePeriodToggle('PM')}
                  className={cn(
                    'rounded-lg px-3 py-1 text-sm font-medium transition-colors ease-emphasized-decelerate',
                    period === 'PM'
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-highest'
                  )}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Clock Face */}
            <div 
              className="relative h-[256px] w-[256px] mx-auto rounded-full bg-surface-container-highest cursor-pointer select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleClockInteraction}
            >
              <svg className="absolute inset-0 pointer-events-none" viewBox={`0 0 ${CLOCK_DIAMETER} ${CLOCK_DIAMETER}`}>
                {/* Dial selector center */}
                <circle 
                  cx={CLOCK_CENTER} 
                  cy={CLOCK_CENTER} 
                  r={DIAL_SELECTOR_CENTER_RADIUS} 
                  fill="currentColor" 
                  className="text-primary" 
                />

                {/* Hours mode: Dial selector track and container */}
                {mode === 'hours' && (
                  <>
                    {/* Dial selector track */}
                    <line
                      x1={CLOCK_CENTER}
                      y1={CLOCK_CENTER}
                      x2={getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).x}
                      y2={getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).y}
                      stroke="currentColor"
                      strokeWidth={SELECTOR_TRACK_THICKNESS}
                      className="text-primary"
                    />
                    {/* Dial selector container */}
                    <circle
                      cx={getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).x}
                      cy={getPosition(getAngle(hours % 12, 12), NUMBER_RADIUS).y}
                      r={DIAL_SELECTOR_CONTAINER_RADIUS}
                      fill="currentColor"
                      className="text-primary"
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
                      x2={getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).x}
                      y2={getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).y}
                      stroke="currentColor"
                      strokeWidth={SELECTOR_TRACK_THICKNESS}
                      className="text-primary"
                    />
                    {/* Dial selector container */}
                    <circle
                      cx={getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).x}
                      cy={getPosition(getAngle(minutes / 5, 12), NUMBER_RADIUS).y}
                      r={DIAL_SELECTOR_CONTAINER_RADIUS}
                      fill="currentColor"
                      className="text-primary"
                    />
                  </>
                )}
              </svg>

              {/* Hour numbers */}
              {mode === 'hours' &&
                hoursArray.map((hour) => {
                  const angle = getAngle(hour % 12, 12);
                  const pos = getPosition(angle, NUMBER_RADIUS);
                  const isUnderSelectorContainer = isNumberUnderSelectorContainer(hour, true);
                  return (
                    <button
                      key={hour}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
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
                          const calculatedHour = Math.round((angle / 360) * 12) || 12;
                          setHours(calculatedHour);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!justFinishedDrag) {
                          handleHourSelect(hour);
                        }
                      }}
                      className={cn(
                        "absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full typescale-body-large transition-all duration-200",
                        isUnderSelectorContainer ? "text-on-primary" : "text-on-surface"
                      )}
                      style={{ left: pos.x, top: pos.y }}
                    >
                      {hour}
                    </button>
                  );
                })}

              {/* Minute numbers */}
              {mode === 'minutes' &&
                minutesArray.map((minute) => {
                  const angle = getAngle(minute / 5, 12);
                  const pos = getPosition(angle, NUMBER_RADIUS);
                  const isUnderSelectorContainer = isNumberUnderSelectorContainer(minute, false);
                  return (
                    <button
                      key={minute}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
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
                          const calculatedMinute = Math.floor((angle / 360) * 60) % 60;
                          setMinutes(calculatedMinute);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!justFinishedDrag) {
                          handleMinuteSelect(minute);
                        }
                      }}
                      className={cn(
                        "absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full typescale-body-large transition-all duration-200",
                        isUnderSelectorContainer ? "text-on-primary" : "text-on-surface"
                      )}
                      style={{ left: pos.x, top: pos.y }}
                    >
                      {String(minute).padStart(2, '0')}
                    </button>
                  );
                })}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="text" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" variant="text" onClick={handleConfirm}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

