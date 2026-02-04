import { CLOCK_CONSTANTS } from './constants';

/**
 * Calculate angle for clock hand position
 * @param value - The hour or minute value
 * @param total - Total values (12 for hours, 60 for minutes)
 * @returns Angle in degrees (0° = 12 o'clock, 90° = 3 o'clock)
 */
export function getAngle(value: number, total: number): number {
  return (value * 360) / total - 90;
}

/**
 * Convert angle and radius to x,y coordinates on clock face
 * @param angle - Angle in degrees
 * @param radius - Radius from center
 * @returns Position coordinates {x, y}
 */
export function getPosition(angle: number, radius: number): { x: number; y: number } {
  const radian = (angle * Math.PI) / 180;
  return {
    x: Math.cos(radian) * radius + CLOCK_CONSTANTS.CENTER,
    y: Math.sin(radian) * radius + CLOCK_CONSTANTS.CENTER,
  };
}

/**
 * Check if a number is under the dial selector container
 * @param numberValue - The hour or minute value
 * @param isHourMode - Whether in hour mode
 * @param hours - Current hour value
 * @param minutes - Current minute value
 * @returns True if number is under selector
 */
export function isNumberUnderSelectorContainer(
  numberValue: number,
  isHourMode: boolean,
  hours: number,
  minutes: number,
): boolean {
  if (isHourMode) {
    return numberValue % 12 === hours % 12;
  } else {
    const selectedAngle = (minutes / 60) * 360;
    const numberAngle = (numberValue / 60) * 360;
    const angleDiff = Math.abs(selectedAngle - numberAngle);
    return angleDiff < 15 || angleDiff > 345;
  }
}

/**
 * Cubic bezier easing function for emphasized decelerate animation
 * Control points: (0.05, 0.7) and (0.1, 1)
 * @param t - Progress value (0 to 1)
 * @returns Eased progress value
 */
export function emphasizedDecelerate(t: number): number {
  const cx = 3 * 0.05;
  const bx = 3 * (0.1 - 0.05) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * 0.7;
  const by = 3 * (1 - 0.7) - cy;
  const ay = 1 - cy - by;

  const t2 = t * t;
  const t3 = t2 * t;

  return ay * t3 + by * t2 + cy * t;
}

/**
 * Calculate the angle from mouse position relative to clock center
 * @param rect - Bounding rectangle of clock element
 * @param clientX - Mouse X position
 * @param clientY - Mouse Y position
 * @returns Angle in degrees (0-360)
 */
export function calculateAngleFromMouse(
  rect: DOMRect,
  clientX: number,
  clientY: number,
): number {
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const x = clientX - rect.left - centerX;
  const y = clientY - rect.top - centerY;

  let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;
  
  return angle;
}

/**
 * Convert angle to hour value (1-12)
 * @param angle - Angle in degrees
 * @returns Hour value
 */
export function angleToHour(angle: number): number {
  return Math.round((angle / 360) * 12) || 12;
}

/**
 * Convert angle to minute value (0-59)
 * @param angle - Angle in degrees
 * @returns Minute value
 */
export function angleToMinute(angle: number): number {
  return Math.floor((angle / 360) * 60) % 60;
}
