# Time Picker Refactoring Plan

## Current Status

✅ **Keyboard Mode Feature Complete** - User can toggle between dial and keyboard-only input

**Current file size:** ~1300 lines (single file)

## Why Refactor?

- **Maintainability**: Large files are harder to navigate and understand
- **Testability**: Smaller, focused units are easier to test
- **Reusability**: Extracted components can be reused elsewhere
- **Collaboration**: Smaller files reduce merge conflicts
- **Performance**: Code splitting and lazy loading opportunities

## Proposed Folder Structure

```text
time-picker/
├── index.ts                          # Main export
├── time-picker.tsx                   # Coordinator component (~250 lines)
│
├── components/
│   ├── time-selector.tsx             # Hour/minute input (~100 lines)
│   ├── period-selector.tsx           # AM/PM toggle (~80 lines)
│   ├── clock-dial.tsx                # SVG clock face (~250 lines)
│   ├── clock-numbers.tsx             # Hour/minute number buttons (~100 lines)
│   └── manual-input-field.tsx        # Input field with icon (~80 lines)
│
├── hooks/
│   ├── use-time-state.ts             # Time state management (~80 lines)
│   ├── use-clock-interaction.ts      # Mouse/drag handlers (~150 lines)
│   ├── use-manual-input.ts           # Manual segmented input logic (~120 lines)
│   └── use-time-selector-edit.ts     # TimeSelector edit logic (~100 lines)
│
├── utils/
│   ├── angle-calculations.ts         # getAngle, getPosition, getValueFromAngle
│   ├── time-operations.ts            # initializeTimeState, createDateFromTime
│   └── clock-geometry.ts             # isNumberUnderSelectorContainer
│
├── constants.ts                      # All constants
├── types.ts                          # All TypeScript interfaces
└── README.md                         # Updated with new structure
```

## Refactoring Phases

### Phase 1: Extract Constants and Types (Low Risk)

**Goal**: Centralize all constants and type definitions

**Files to create:**
- `constants.ts` - Move CLOCK_CONSTANTS, ANIMATION_CONSTANTS, MANUAL_SEGMENT_RANGES
- `types.ts` - Move all interfaces (TimePickerProps, TimeSelectorProps, etc.)

**Benefit**: Easier to find and update configuration
**Risk**: Very low - just moving declarations
**Estimated time**: 30 minutes

---

### Phase 2: Extract Utility Functions (Low Risk)

**Goal**: Move pure functions to utility files

**Files to create:**
- `utils/angle-calculations.ts`
  - `getAngle()`
  - `getPosition()`
  - `getValueFromAngle()`
  
- `utils/clock-geometry.ts`
  - `isNumberUnderSelectorContainer()`
  
- `utils/time-operations.ts`
  - Already extracted: `initializeTimeState()`, `createDateFromTime()`, `formatTimeUtil()`
  - Add: `getManualDisplayValue()`, `selectSegment()`

**Benefit**: Pure functions are easy to test and reuse
**Risk**: Very low - no component dependencies
**Estimated time**: 1 hour

---

### Phase 3: Extract Sub-Components (Medium Risk)

**Goal**: Move inline components to separate files

**Order of extraction (safest to riskiest):**

1. **PeriodSelector** (Safest - minimal dependencies)
   - Already well-encapsulated
   - Props clearly defined
   - No shared state beyond props
   
2. **TimeSelector** (Safe - clear interface)
   - Well-defined props
   - Self-contained ripple logic
   - Clear edit state management

3. **ClockNumbers** (Medium - depends on handlers)
   - Hour/minute number buttons
   - Needs click/drag handlers from parent
   - Styling logic for active state

4. **ClockDial** (Medium - complex)
   - SVG clock face with dial selector
   - Needs mode, hours, minutes state
   - Includes geometry calculations

**Benefit**: Each component has clear responsibilities
**Risk**: Medium - need to ensure props are correctly passed
**Estimated time**: 3-4 hours

---

### Phase 4: Extract Custom Hooks (Higher Risk)

**Goal**: Encapsulate complex state logic

**Hooks to create:**

1. **useTimeState** (Foundational)
   - Manages hours, minutes, period state
   - Handles value initialization
   - Provides setter functions
   
2. **useClockInteraction** (Complex)
   - Mouse/drag event handlers
   - isDragging, justFinishedDrag state
   - handleMouseDown, handleMouseMove, handleMouseUp
   - handleClockInteraction
   
3. **useManualInput** (Complex)
   - isManualEditing, activeSegment, segmentBuffer state
   - handleManualFocus, handleManualChange, handleManualBlur
   - handleManualKeyDown with segment logic
   - Segment navigation (advance, retreat)
   
4. **useTimeSelectorEdit** (Complex)
   - editingHours, editingMinutes, temp values
   - commitHoursValue, commitMinutesValue
   - handleHoursClick, handleMinutesClick
   - handleHoursBlur, handleMinutesBlur, etc.

**Benefit**: Separates concerns, makes logic testable
**Risk**: Higher - state dependencies between hooks
**Estimated time**: 4-5 hours

---

### Phase 5: Refactor Main Component (Final)

**Goal**: Reduce main component to coordinator role

**Responsibilities after refactoring:**
- Dialog state (isOpen, showDial)
- Mode state (hours/minutes)
- Compose sub-components
- Pass props to hooks and components
- Handle confirm/cancel actions

**Target size**: 200-300 lines (from 1300)

**Benefit**: Easy to understand overall flow
**Risk**: Medium - need to ensure all pieces work together
**Estimated time**: 2-3 hours

---

## Testing Strategy

### After Each Phase:

1. **Visual testing**: Open test page, verify all features work
2. **Interaction testing**: Test all input methods (dial, keyboard, manual)
3. **Error checking**: Run TypeScript compiler, check for errors
4. **Functionality checklist**:
   - ✅ Dial click/drag works
   - ✅ TimeSelector editing works
   - ✅ Manual input with segmented editing works
   - ✅ Keyboard mode toggle works
   - ✅ AM/PM toggle works
   - ✅ Confirm/Cancel works
   - ✅ Icon positioning works
   - ✅ Validation works (hours 1-12, minutes 0-59)

---

## Migration Path (Safe Approach)

### Option A: Gradual Refactoring (Recommended)

1. Keep `time-picker.tsx` as-is (working version)
2. Create `time-picker-v2/` folder with refactored structure
3. Build and test v2 completely
4. Once stable, replace v1 with v2
5. Delete old file

**Benefit**: Can always roll back to working version
**Estimated time**: 2-3 weeks (working incrementally)

---

### Option B: In-Place Refactoring (Faster, Riskier)

1. Create branch: `feat/refactor-time-picker`
2. Extract one phase at a time
3. Test after each extraction
4. Commit frequently with atomic changes
5. PR when complete

**Benefit**: Faster, cleaner git history
**Risk**: Breaks existing functionality if mistakes
**Estimated time**: 1 week (full-time focus)

---

## Code Quality Improvements

### During Refactoring, Also Address:

1. **Add JSDoc comments** to all exported functions
2. **Extract magic numbers** to named constants
3. **Add error boundaries** for graceful failure
4. **Improve accessibility** - audit ARIA labels
5. **Optimize performance** - useMemo for expensive calculations
6. **Add unit tests** for utility functions
7. **Consider Storybook** for component documentation

---

## When to Refactor?

### Now is a good time because:
- ✅ Feature set is stabilizing
- ✅ File is approaching 1300 lines
- ✅ Clear boundaries between concerns
- ✅ Good test coverage opportunity

### Wait if:
- ❌ Actively adding major new features
- ❌ Approaching deadline
- ❌ No time for thorough testing

---

## Recommended Next Steps

1. **Create branch**: `feat/refactor-time-picker`
2. **Start with Phase 1**: Extract constants and types (30 min, low risk)
3. **Test thoroughly**: Ensure nothing breaks
4. **Continue incrementally**: One phase per commit
5. **Document as you go**: Update README with new structure

---

## Benefits Summary

**After full refactoring:**

- 📦 **Modular**: 8-10 small files instead of 1 large file
- 🧪 **Testable**: Pure functions and isolated components
- 📖 **Readable**: Clear separation of concerns
- 🔄 **Reusable**: Components can be used elsewhere
- 🛠️ **Maintainable**: Easy to modify one part without affecting others
- 👥 **Collaborative**: Reduces merge conflicts
- ⚡ **Performant**: Opportunities for code splitting

---

## Questions to Consider

1. **Do we need all hooks immediately?** - Consider extracting only the most complex first
2. **Should ClockDial be separate component?** - It's large but tightly coupled
3. **Manual input vs TimeSelector editing** - Can these be unified?
4. **Lazy loading** - Should clock dial lazy load for faster initial render?
5. **Storybook** - Would component stories help development?

---

## Conclusion

**Recommendation**: Start with **Phase 1-2 immediately** (constants, types, utils) as they're low-risk and provide immediate value. Then assess if Phase 3-5 are needed based on:
- Team capacity
- Feature roadmap
- Time availability
- Testing resources

The current implementation works well, so refactoring can be done incrementally over time rather than as a big-bang rewrite.
