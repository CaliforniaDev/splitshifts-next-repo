# Time Picker Component

Custom time picker with 12-hour format, clock face dial, and editable inputs.

**Location**: `app/components/ui/inputs/time-picker.tsx`

## Current Status

✅ Vertical layout implementation complete
✅ Interaction states refined (focus borders, hover overlays, ripples)
✅ TimeSelector and PeriodSelector sub-components
✅ Manual input field with icon-triggered dial
✅ Keyboard-only mode with dial toggle
✅ Keyboard navigation support

## Features

### Dual Input Modes

#### Dial Mode (Default)

- Visual clock face with clickable/draggable interface
- Click hour numbers (1-12) or minute markers (00-55)
- Drag around clock face for continuous selection
- Smooth animations with emphasized decelerate easing

#### Keyboard Mode

- Click keyboard icon in dialog header to hide dial
- Use TimeSelector inputs directly (hours, minutes, period)
- Compact layout (328px width) for quick edits
- Perfect for power users and accessibility

#### Input Methods

1. **Manual Input Field** (External)
   - Type directly in the input field with clock icon
   - Auto-formats: "130p" → "01:30 PM"
   - Segmented editing: hours → minutes → period
   - Click clock icon to open picker dialog

2. **TimeSelector Inputs** (In Dialog)
   - Click hour/minute labels to edit
   - Auto-complete after 2 digits
   - Visual feedback with active/focus states
   - Available in both dial and keyboard modes

3. **Clock Face Interaction** (Dial Mode)
   - Click numbers for instant selection
   - Drag around clock for smooth adjustment
   - Auto-transitions hours → minutes
   - Animated hand with selector container

4. **AM/PM Toggle**
   - Ripple effects on click
   - Keyboard support (A/P keys in manual input)
   - Visual active state with tertiary container

## Pending Features

### High Priority

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

### Manual Input Updates

- Input highlights hours on focus, auto-advances to minutes, and accepts A/P for AM/PM
- Clock icon opens the picker dialog without entering edit mode
- Icon position is configurable via `iconPosition` prop
- Smart auto-formatting with digit parsing and validation

### Keyboard Mode Updates

- Keyboard icon button in bottom-left corner toggles between dial and keyboard-only modes
- Smooth Material Design motion with custom easing (cubic-bezier(0.38, 1.21, 0.22, 1.00))
- Dialog height collapses/expands with the dial (no hardcoded heights)
- Clock dial fades/scales with expressive slow effects (500ms)
- Dialog height collapse/expand uses max-height transition (expressive slow effects, 500ms)
- Dial fades/scales in sync inside the collapsing dialog
- Icon morphs between keyboard and clock with crossfade effect (500ms)
- TimeSelector inputs always available in both modes
- Committed values on mode switch to prevent data loss
- Focus outline matches button component styling (2px secondary, rounded-full)

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
