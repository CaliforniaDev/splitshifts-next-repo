/**
 * Clock geometry constants for rendering the dial
 */
export const CLOCK_CONSTANTS = {
  DIAMETER: 256,
  CENTER: 128,
  DIAL_SELECTOR_CENTER_RADIUS: 4,
  DIAL_SELECTOR_CONTAINER_RADIUS: 24,
  NUMBER_BUTTON_SIZE: 48,
  NUMBER_RADIUS: 102,
  EDGE_GAP: 2,
  SELECTOR_TRACK_THICKNESS: 2,
} as const;

/**
 * Animation timing configuration
 */
export const ANIMATION_CONSTANTS = {
  TRANSITION_TO_MINUTES_DURATION: 250,
  TRANSITION_STEPS: 20,
  TRANSITION_DELAY: 50,
  DRAG_BLOCK_DURATION: 100,
} as const;

/**
 * Responsive breakpoint for desktop vs mobile defaults
 */
export const DESKTOP_BREAKPOINT = '(min-width: 768px)';
