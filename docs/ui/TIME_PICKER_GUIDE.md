# Time Picker Component Guide

## Overview

The Time Picker is a custom component for selecting times in 12-hour format. It features both a visual clock interface and editable time inputs with smooth animations.

**Location**: `splitshifts-app/app/components/ui/inputs/time-picker.tsx`

## Key Features

- **Dual Input Methods**: Click the clock icon to use the dial, or type directly in the field
- **Segmented Manual Input**: Hours highlight on focus, auto-advance to minutes, A/P sets AM/PM
- **Visual Feedback**: Animated hand transitions, color-coded active states, number highlighting
- **Interaction States**: Hover overlays on time selectors, ripple effects on AM/PM toggles
- **Keyboard Support**: Enter/Tab navigation between fields
- **Validation**: Hours (1-12), Minutes (0-59) with automatic clamping; optional AM/PM
- **Smooth Animations**: Emphasized decelerate easing for natural motion, proper color tokens

## Component Architecture

### Props Interface

```typescript
interface TimePickerProps {
  label: string;                    // Input field label
  value?: Date | null;              // Current time value (JavaScript Date object)
  onChange?: (newValue: Date | null) => void;  // Callback when time changes
  onBlur?: () => void;              // Callback when input loses focus
  error?: boolean;                  // Show error state
  errorMessage?: string;            // Error message text
  supportingText?: string;          // Helper text below input
  disabled?: boolean;               // Disable interaction
  required?: boolean;               // Show required indicator
  className?: string;               // Additional CSS classes
  iconPosition?: 'start' | 'end';   // Position of the clock icon
}
```

### Data Flow

1. **External Value → Component State**
   - `value` prop (Date object) is converted to `hours`, `minutes`, `period` state on mount/open
   - Uses `getHours()` and `getMinutes()` native Date methods

2. **User Interaction → State Updates**
   - Clock clicks/drags → `handleClockInteraction()` → updates `hours`/`minutes`
   - Typing in inputs → `handleHoursChange()`/`handleMinutesChange()` → updates state
   - Mode switching → `setMode('hours' | 'minutes')` → changes clock display

3. **State → External Value**
   - Clicking "OK" → `handleConfirm()` → creates new Date object → calls `onChange()`
   - Converts 12-hour format to 24-hour for Date object

## Core Concepts

### 0. Sub-Components

**TimeSelector Component**: Displays and edits hours or minutes (80px × 96px)

- Unified component: Container div wraps input, manages focus states
- Input always present but readonly when not editing
- Hover state: 8% opacity overlay (only when inactive)
- Focus state: 3px secondary border (inset shadow, no text shifting)
- Active state: Primary container background
- Inactive state: Surface container highest background
- Ripple effects: Available but currently disabled for time selectors
- Focus management: Container focusable when not editing (tabIndex=0), input focusable when editing

**PeriodSelector Component**: AM/PM toggle buttons (52px wide)

- Two vertically stacked buttons with 1px outline border
- Ripple effects on click (0.2 opacity, currentColor, separate instances per button)
- Active state: Tertiary container background
- Inactive state: Surface container high background  
- Hover state: 8% opacity overlay
- Focus state: 3px secondary outline border (outside, with 2px offset and z-10)
- 1px divider line between buttons (bg-outline)

### 1. Time Modes

```typescript
type TimeMode = 'hours' | 'minutes';
```

The picker has two modes that determine what the clock face displays:

- **hours**: Shows numbers 1-12, dial points to selected hour
- **minutes**: Shows 00, 05, 10, ... 55, dial points to selected minute

Switching modes:

- Clicking hour/minute selector label → switches mode
- Selecting an hour → auto-transitions to minutes with animation
- Opening picker → always starts in hours mode

### 2. Clock Face Geometry

```typescript
const CLOCK_DIAMETER = 256;           // Total clock size
const CLOCK_CENTER = 128;             // Center point (DIAMETER / 2)
const NUMBER_RADIUS = 102;            // Distance from center to numbers
const DIAL_SELECTOR_CONTAINER_RADIUS = 24;  // Circle at end of hand (48px diameter)
const DIAL_SELECTOR_CENTER_RADIUS = 4;      // Center dot (8px diameter)
```

**Coordinate System:**

- Origin (0,0) is top-left of SVG
- Center of clock is at (128, 128)
- Angles: 0° = 12 o'clock, 90° = 3 o'clock, 180° = 6 o'clock, 270° = 9 o'clock

### 3. Angle Calculations

**Converting time value to angle:**

```typescript
const getAngle = (value: number, total: number) => {
  return (value * 360) / total - 90;  // -90 adjusts for 12 o'clock being at top
};
```

**Converting mouse position to angle:**

```typescript
let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
if (angle < 0) angle += 360;
```

**Converting angle to time:**

```typescript
// Hours: 0-360° maps to 1-12
const hour = Math.round((angle / 360) * 12) || 12;

// Minutes: 0-360° maps to 0-59
const minute = Math.floor((angle / 360) * 60) % 60;
```

### 4. TimeSelectorLabel Component

Extracted sub-component that handles the editable hour/minute display boxes at the top:

```typescript
<TimeSelectorLabel
  value={hours}                    // Number to display (1-12 or 0-59)
  isActive={mode === 'hours'}      // Highlighted state
  isEditing={editingHours}         // Show input vs button
  tempValue={tempHoursValue}       // Current input text
  onEdit={handleHoursClick}        // Enter edit mode
  onChange={handleHoursChange}     // Handle typing
  onBlur={handleHoursBlur}         // Exit edit mode
  onKeyDown={handleHoursKeyDown}   // Handle Enter/Tab
  inputRef={hoursInputRef}         // Ref for programmatic blur
/>
```

**Visual States:**

- **Inactive**: Gray background, no border
- **Active**: Primary container background, 2px primary border
- **Editing**: Same styling + visible cursor with primary color

## User Interaction Flows

### Flow 1: Clicking Hour Number

```text
User clicks "3" on clock face
  ↓
handleHourSelect(3) called
  ↓
setHours(3)
setMode('minutes')
  ↓
Animation: hand smoothly moves from hour position to 30-minute mark
  ↓
Clock face updates to show minute numbers
```

### Flow 2: Typing Hours

```text
User clicks hour selector label
  ↓
handleHoursClick()
  → setEditingHours(true)
  → setTempHoursValue('')
  → setMode('hours')
  ↓
User types "1"
  → handleHoursChange() updates tempHoursValue
  ↓
User types "2" (2nd digit)
  → Validates: parseInt("12") = 12 (valid)
  → setHours(12)
  → Auto-advance: setEditingMinutes(true), setMode('minutes')
```

### Flow 3: Dragging on Clock Face

```text
User presses mouse down on clock face
  ↓
handleMouseDown()
  → closeInputs() (exits any editing mode)
  → setIsDragging(true)
  → handleClockInteraction() (calculates angle, updates time)
  ↓
User moves mouse (dragging)
  ↓
handleMouseMove()
  → if (isDragging) handleClockInteraction()
  ↓
User releases mouse
  ↓
handleMouseUp()
  → if (mode === 'hours') handleHourSelect(hours) (auto-transition)
  → setIsDragging(false)
```

## Animation System

### Emphasized Decelerate Easing

The component uses a custom cubic bezier curve for smooth, natural motion:

```typescript
const emphasizedDecelerate = (t: number): number => {
  // Cubic bezier with control points P1(0.05, 0.7) and P2(0.1, 1)
  // Starts slow, accelerates, then decelerates smoothly
  const cx = 3 * 0.05;
  const bx = 3 * (0.1 - 0.05) - cx;
  const ax = 1 - cx - bx;
  
  const cy = 3 * 0.7;
  const by = 3 * (1 - 0.7) - cy;
  const ay = 1 - cy - by;
  
  const t2 = t * t;
  const t3 = t2 * t;
  
  return ay * t3 + by * t2 + cy * t;
};
```

### Hour → Minute Transition

When an hour is selected, the hand animates to the 30-minute position:

```typescript
const TRANSITION_TO_MINUTES_DURATION = 250;  // Total animation time
const TRANSITION_STEPS = 20;                 // Number of frames
const TRANSITION_DELAY = 50;                 // Delay before starting

// Animation loop
setInterval(() => {
  currentStep++;
  const progress = currentStep / TRANSITION_STEPS;           // 0 to 1
  const easedProgress = emphasizedDecelerate(progress);      // Apply easing
  const currentMinute = startMinute + (diff * easedProgress); // Interpolate
  setMinutes(currentMinute);
}, stepDuration);
```

## State Management

### Component State

```typescript
// Dialog visibility
const [isOpen, setIsOpen] = useState(false);

// Clock display mode
const [mode, setMode] = useState<TimeMode>('hours');

// Time values (converted from Date prop)
const [hours, setHours] = useState(1-12);        // 12-hour format
const [minutes, setMinutes] = useState(0-59);
const [period, setPeriod] = useState<'AM' | 'PM'>();

// Drag interaction state
const [isDragging, setIsDragging] = useState(false);
const [justFinishedDrag, setJustFinishedDrag] = useState(false);

// Input editing state
const [editingHours, setEditingHours] = useState(false);
const [editingMinutes, setEditingMinutes] = useState(false);
const [tempHoursValue, setTempHoursValue] = useState('');
const [tempMinutesValue, setTempMinutesValue] = useState('');
```

### Helper Function: closeInputs()

Centralized logic to exit any editing mode and blur inputs:

```typescript
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
```

Called whenever:

- User interacts with clock face (drag/click)
- User clicks on clock numbers
- Prevents showing input cursor during dial interaction

## Validation Logic

### Hours (1-12)

```typescript
let numValue = parseInt(tempHoursValue, 10);

if (isNaN(numValue) || numValue < 1) {
  numValue = 1;  // Minimum
} else if (numValue > 12) {
  numValue = 12;  // Maximum
}

setHours(numValue);
```

### Minutes (0-59)

```typescript
let numValue = parseInt(tempMinutesValue, 10);

if (isNaN(numValue) || numValue < 0) {
  numValue = 0;  // Minimum
} else if (numValue > 59) {
  numValue = 59;  // Maximum
}

setMinutes(numValue);
```

### Auto-complete Behavior

When user types 2nd digit, immediately validate and move to next field:

```typescript
if (value.length === 2) {
  // Validate directly from input value (not state)
  let numValue = parseInt(value, 10);
  // ... validation ...
  setMinutes(numValue);
  setEditingMinutes(false);  // Close input
}
```

**Why not use state?** State updates are asynchronous, causing timing bugs where the old value is read instead of the newly typed value.

## Time Format Conversion

### Display (12-hour) → Internal (Date object 24-hour)

```typescript
const handleConfirm = () => {
  const date = new Date();
  let hrs = hours;  // 1-12
  
  // Convert to 24-hour format
  if (period === 'PM' && hrs !== 12) hrs += 12;  // 1PM → 13, 11PM → 23
  if (period === 'AM' && hrs === 12) hrs = 0;    // 12AM → 0
  
  date.setHours(hrs, minutes, 0, 0);
  onChange?.(date);
};
```

### Internal (Date object) → Display (12-hour)

```typescript
const [hours, setHours] = useState(() => {
  if (value) {
    const hrs = value.getHours();  // 0-23
    return hrs === 0 ? 12 : hrs > 12 ? hrs - 12 : hrs;  // Convert to 1-12
  }
  return 12;
});

const [period, setPeriod] = useState<Period>(() => {
  if (value) {
    const hrs = value.getHours();
    return hrs >= 12 ? 'PM' : 'AM';
  }
  return 'AM';
});
```

## Styling & Design Tokens

### Color Tokens

```css
bg-surface-container-highest     /* Clock face background */
bg-primary-container             /* Active selector label background */
text-on-primary-container        /* Active selector label text */
text-on-surface-variant          /* Inactive elements */
text-on-surface                  /* Default text */
text-primary                     /* Dial hand/circle */
text-on-primary                  /* Numbers under dial selector */
border-primary                   /* Active selector border */
caret-primary                    /* Input cursor color */
```

### Typography Scale

```css
typescale-display-large          /* Hour/minute display (57px) */
typescale-body-large             /* Clock face numbers (16px) */
typescale-label-medium           /* Dialog title "Select time" */
```

### Interaction States

**TimeSelector (Hour/Minute Inputs):**

- Default: Surface container highest background
- Hover: 8% opacity overlay (`hover:before:opacity-8`) - only when inactive
- Focus: 3px secondary border via inset shadow (`focus-within:shadow-[inset_0_0_0_3px_#535F70]`)
  - No text shifting - uses box-shadow instead of border
  - No overlay on focus (only on hover)
- Active: Primary container background
- Container: Focusable when not editing (`tabIndex={!isEditing ? 0 : -1}`)
- Input: Focusable only when editing (`tabIndex={isEditing ? 0 : -1}`)
- Ripple effects: System integrated but disabled (`disabled: isEditing`)

**PeriodSelector (AM/PM Toggles):**

- Default: Surface container high background (inactive)
- Hover: 8% opacity overlay (`hover:before:opacity-8`)
- Focus: 3px secondary outline border (`focus-visible:outline-[3px] focus-visible:outline-secondary`)
  - Outside border with 2px offset (`outline-offset-2`)
  - Elevated on focus (`focus-visible:z-10`) to appear in front
  - Only on keyboard focus, not mouse click (`focus-visible`)
- Active: Tertiary container background
- Ripple: 0.2 opacity, currentColor, separate instances per button (AM/PM)
  - Unique keyframe names: `PeriodSelectorAM`, `PeriodSelectorPM`

### Custom Transitions

```css
ease-emphasized-decelerate       /* Tailwind custom easing for smooth animations */
transition-colors                /* Color transitions (200ms default) */
transition-all duration-200      /* Multi-property transitions */
```

### Layout Specifications (Vertical Orientation)

**Dialog Container:**

- Padding: 24px (`p-6`)
- Width: Fit content (`w-fit`)
- Border: None (`border-none`)

**Header:**

- Typography: `typescale-label-medium`
- Color: `text-on-surface-variant`
- Gap below: 20px (`mt-5`)

**Time Display Wrapper:**

- Height: 80px (`h-20`)
- Gap: 12px between sections (`gap-3`)

**Time Selectors:**

- Size: 80px × 96px (`h-20 w-24`)
- Separator: 24px width (`w-6`), vertically centered (`-translate-y-1`)

**Period Selector:**

- Width: 52px (`w-[52px]`)
- Border: 1px outline (`border border-outline`)

**Clock Face:**

- Gap above: 36px (`mt-9`)
- Gap below: 24px (Footer `mt-6`)

**Keyboard Toggle:**

- Position: Absolute bottom-left (`bottom-6 left-6`)
- Size: 24px icon

### Custom Transitions

```css
ease-emphasized-decelerate       /* Tailwind custom easing for AM/PM buttons */
transition-colors                /* Color transitions (200ms default) */
transition-all duration-200      /* Multi-property transitions */
```

## Common Issues & Solutions

### Issue: "Drag not working from number buttons"

**Cause**: `onMouseDown` on number buttons stops propagation, preventing clock face drag handler

**Solution**: Add full drag initialization logic inside number button `onMouseDown`:

```typescript
onMouseDown={e => {
  e.stopPropagation();
  e.preventDefault();
  closeInputs();
  setIsDragging(true);
  // Calculate angle from mouse position...
}}
```

### Issue: "Input cursor doesn't disappear when clicking dial"

**Cause**: State changes don't trigger DOM blur

**Solution**: Manually blur input elements using refs:

```typescript
if (editingHours && hoursInputRef.current) {
  hoursInputRef.current.blur();
}
```

### Issue: "Typing '55' in minutes becomes '05'"

**Cause**: Auto-complete reads stale state instead of current input value

**Solution**: Validate directly from input value, not state:

```typescript
if (value.length === 2) {
  let numValue = parseInt(value, 10);  // Use 'value' not tempMinutesValue
  // ...
}
```

### Issue: "Clock face size wrong after refactor"

**Cause**: Tailwind can't interpolate JavaScript variables in template literals

**Solution**: Use literal values in className:

```typescript
// ❌ WRONG
className={`h-[${CLOCK_DIAMETER}px]`}

// ✅ CORRECT
className="h-[256px] w-[256px]"
```

## Testing Checklist

- [ ] Click hour numbers → auto-transitions to minutes
- [ ] Click minute numbers → updates time
- [ ] Drag from empty clock face → updates time
- [ ] Drag from number buttons → updates time
- [ ] Type 2 digits in hours → auto-advances to minutes
- [ ] Type 2 digits in minutes → closes input
- [ ] Enter/Tab navigation works between fields
- [ ] Clicking dial while editing → closes inputs immediately
- [ ] Cancel button → restores original time
- [ ] OK button → calls onChange with correct Date object
- [ ] Opening picker always starts in hours mode
- [ ] AM/PM toggle updates correctly
- [ ] Invalid inputs (13, 99, etc.) → clamped to valid range

## Future Enhancements

- **Touch support**: Add `onTouchStart/Move/End` handlers for mobile
- **Keyboard navigation**: Arrow keys to adjust time, Escape to close
- **24-hour format**: Optional prop to show 00-23 instead of 1-12 + AM/PM
- **Step intervals**: Prop to limit minutes to 5, 10, 15, or 30-minute intervals
- **Accessibility**: Full ARIA labels, keyboard-only operation, screen reader support
- **Custom caret width**: Browser-dependent, no standard CSS property exists yet
