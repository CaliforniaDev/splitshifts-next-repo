import { Period } from '@/app/lib/utils/time';

/**
 * Main time picker component props
 */
export interface TimePickerProps {
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
  iconPosition?: 'start' | 'end';
}

/**
 * Time mode for clock dial (hours or minutes)
 */
export type TimeMode = 'hours' | 'minutes';

/**
 * Manual input segment type
 */
export type ManualSegment = 'hours' | 'minutes' | 'period';

/**
 * Time selector (hour/minute display) props
 */
export interface TimeSelectorProps {
  value: number;
  isActive: boolean;
  isEditing: boolean;
  tempValue: string;
  onEdit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  rippleKeyframeName: string;
}

/**
 * Period selector (AM/PM) props
 */
export interface PeriodSelectorProps {
  period: Period;
  onToggle: (period: Period) => void;
}

/**
 * Clock dial component props
 */
export interface ClockDialProps {
  mode: TimeMode;
  hours: number;
  minutes: number;
  showDial: boolean;
  justFinishedDrag: boolean;
  setHours: (h: number) => void;
  setMinutes: (m: number) => void;
  setIsDragging: (dragging: boolean) => void;
  setJustFinishedDrag: (finished: boolean) => void;
  onHourSelect: (hour: number) => void;
  onMinuteSelect: (minute: number) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClockInteraction: (e: React.MouseEvent<HTMLDivElement>) => void;
  closeInputs: () => void;
}
