# Time Picker Component

Custom time picker with 12-hour format, clock face dial, and editable inputs.

**Location**: `app/components/ui/inputs/time-picker.tsx`

## Current Status

✅ Vertical layout implementation complete
✅ Interaction states refined (focus borders, hover overlays, ripples)
✅ TimeSelector and PeriodSelector sub-components
✅ Keyboard navigation support

## Pending Features

### High Priority

- [ ] **Input-only mode with dial toggle**: Default view shows only time inputs, keyboard icon toggles dial visibility
- [ ] **Horizontal layout for landscape**: Responsive layout that switches based on viewport width/orientation

### Refactoring Backlog (After Features Complete)

- [x] **Extract time utilities** to `@/app/lib/utils/time.ts` ✅ **COMPLETED**
  - `to12HourFormat()`, `to24HourFormat()`
  - `getPeriodFrom24Hour()`, `formatTime()`
  - `validateHours()`, `validateMinutes()`
  - `initializeTimeState()`, `createDateFromTime()`
  
- [x] **Group constants at top** of file ✅ **COMPLETED**
  - `CLOCK_CONSTANTS` object with geometry values
  - `ANIMATION_CONSTANTS` object with timing values

- [ ] **Evaluate useTimeInput hook** (after input-only mode):
  - Only if duplication becomes clear problem
  - Hours and minutes have different auto-advance/validation logic
  - Wait to see what patterns emerge from new features

- [ ] **Consider clock geometry utilities** (if building another time component):
  - `getClockAngle()`, `getClockPosition()`
  - `getAngleFromMouse()`, `angleToHour()`, `angleToMinute()`
  - `emphasizedDecelerate()` easing function

- [ ] **Extract TimeSelector/PeriodSelector** (when components stabilize):
  - Only if they stop changing frequently
  - Keep co-located until feature set is complete

## Recent Changes

### Refactoring (Latest)

- ✅ **Extracted time utilities** to `app/lib/utils/time.ts`
  - Pure functions for conversion, validation, and formatting
  - Type-safe Period type exported for reuse
  - Comprehensive JSDoc documentation with examples
- ✅ **Grouped constants** into organized objects
  - `CLOCK_CONSTANTS`: Geometry values (diameter, center, radius, etc.)
  - `ANIMATION_CONSTANTS`: Timing values (duration, steps, delay, etc.)

### Interaction State Refinements

- Time selectors: 8% hover overlay, 3px secondary focus border (inset shadow)
- Period selectors: Ripple effects on click, 3px secondary focus outline (outside)
- No overlay on focus (only hover), no text shifting from borders
- Keyboard navigation: Tab focus without auto-editing

### Component Structure

- TimeSelector: Unified input/button component with ripple support
- PeriodSelector: Separate AM/PM toggle with individual ripple instances
- Focus management: Container focusable when not editing, input focusable when editing

## Design Specs

**Vertical Layout:**

- Dialog: 24px padding, fit-content width
- Time display: 80px height wrapper, 12px gap between sections
- Time selectors: 80px × 96px each
- Separator: 24px width, vertically centered
- Period selector: 52px width, outline border
- Clock face: 36px gap above, 24px gap below
- Keyboard icon: Bottom-left absolute positioning

**Colors:**

- Focus border: Secondary (#535F70)
- Active selector: Primary container background
- Active period: Tertiary container background
- Ripple: 0.2 opacity, currentColor

## Files

- `time-picker.tsx` - Main component (600+ lines)
- `README.md` - This file
- Related docs: `docs/ui/TIME_PICKER_GUIDE.md`
