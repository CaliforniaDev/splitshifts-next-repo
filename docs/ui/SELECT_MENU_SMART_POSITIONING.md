# SelectMenu Smart Positioning - Complete Technical Guide

## Table of Contents

1. [Overview](#overview)
2. [The Problem We Solved](#the-problem-we-solved)
3. [Core Concepts](#core-concepts)
4. [Implementation Deep Dive](#implementation-deep-dive)
5. [TypeScript Type System](#typescript-type-system)
6. [React Hooks Explained](#react-hooks-explained)
7. [CSS & Animation System](#css--animation-system)
8. [Material Design 3 Principles](#material-design-3-principles)
9. [Debugging Journey](#debugging-journey)
10. [Best Practices](#best-practices)

---

## Overview

The SelectMenu component is a custom dropdown that implements **Material Design 3** specifications with intelligent positioning. It automatically detects when it would be cut off by container boundaries or viewport edges and repositions itself to remain fully visible.

**Key Features:**

- Smart boundary detection (scroll containers + viewport)
- Automatic upward/downward positioning
- Smooth animations based on direction
- React Hook Form integration
- Accessible (ARIA compliant)

---

## The Problem We Solved

### Initial Issue

When a SelectMenu was placed near the bottom of a scrollable container (like a modal dialog), the dropdown menu would:

1. Open downward (default behavior)
2. Get clipped by the container's `overflow-y-auto` boundary
3. Hide options from the user

### Why This Happened

```typescript
// Dialog with overflow
<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
  {/* SelectMenu here */}
</DialogContent>
```

The `overflow-y-auto` creates a **clipping boundary**. Any absolutely positioned child (like our dropdown) that extends beyond this boundary gets cut off.

### The Solution

We implemented **smart positioning** that:

1. Detects available space in all directions
2. Finds scrollable parent containers
3. Calculates the most restrictive boundary
4. Flips the dropdown upward when needed
5. Uses appropriate animations for each direction

---

## Core Concepts

### 1. React Refs (`useRef`)

**What is a ref?**
A ref is a way to directly access a DOM element in React without causing re-renders.

```typescript
const containerRef = useRef<HTMLDivElement>(null);
```

**Breaking this down:**

- `useRef` - React hook that creates a mutable reference
- `<HTMLDivElement>` - TypeScript generic specifying the type of element
- `null` - Initial value (ref is not attached yet)

**Why use refs here?**
We need to measure the physical position of the SelectMenu on the screen using `getBoundingClientRect()`, which requires direct DOM access.

**Type explanation:**

```typescript
useRef<HTMLDivElement>(null);
// Returns: React.MutableRefObject<HTMLDivElement | null>
```

- `MutableRefObject` - The ref's value can change
- `HTMLDivElement | null` - Can be a div element OR null (before mounting)

### 2. React State (`useState`)

**What is state?**
State is data that can change over time and triggers component re-renders when updated.

```typescript
const [isOpen, setIsOpen] = useState(false);
const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
  'down'
);
```

**Breaking this down:**

- `useState(false)` - Creates state with initial value `false`
- `isOpen` - Current state value (read-only)
- `setIsOpen` - Function to update state
- `<'down' | 'up'>` - TypeScript generic for union type

**Why we need these states:**

1. **`isOpen`** - Tracks if dropdown is visible

   - Type: `boolean`
   - When true: Shows dropdown, runs positioning logic
   - When false: Hides dropdown

2. **`dropdownDirection`** - Tracks which way dropdown opens
   - Type: `'down' | 'up'` (union type - can only be one of these strings)
   - Controls CSS classes and animations
   - Changes based on available space

### 3. The `getBoundingClientRect()` Method

**What it does:**
Returns the size and position of an element relative to the viewport.

```typescript
const rect = containerRef.current.getBoundingClientRect();
```

**Returns an object like:**

```typescript
{
  top: 150,      // Distance from top of viewport
  bottom: 214,   // Distance from top of viewport to bottom edge
  left: 20,      // Distance from left of viewport
  right: 420,    // Distance from left of viewport to right edge
  width: 400,    // Element width
  height: 64,    // Element height
}
```

**Why we need this:**
To calculate available space around the SelectMenu and decide which direction to open.

### 4. Event Loop & `requestAnimationFrame`

**The Problem:**
When we call `setIsOpen(true)`, React schedules a re-render but it doesn't happen immediately. If we try to access `containerRef.current` right away, it might still be null.

**The Solution:**

```typescript
setIsOpen(true); // Schedule re-render

requestAnimationFrame(() => {
  // This runs AFTER the browser has painted the new state
  if (!containerRef.current) return;

  const rect = containerRef.current.getBoundingClientRect();
  // ... positioning logic
});
```

**What `requestAnimationFrame` does:**

- Tells the browser to execute a function before the next repaint
- Ensures the DOM has been updated with the new state
- Runs at ~60fps (every 16.67ms)

**Why use it here:**
By the time our callback runs, React has finished rendering and the ref is guaranteed to be set.

---

## Implementation Deep Dive

### Step 1: State & Refs Setup

```typescript
export default function SelectMenu({
  id,
  label,
  options,
  value,
  // ... other props
  ...props
}: SelectMenuProps & { 'data-testid'?: string }) {
  // State for dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // State for dropdown direction
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');

  // Ref to access the outer container
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref to access the dropdown menu (unused in positioning, but available for future features)
  const menuRef = useRef<HTMLDivElement>(null);
```

**Why separate state for direction?**

- Direction needs to trigger a re-render (to apply different CSS classes)
- State changes cause re-renders; ref changes don't
- Direction affects visual output, so it belongs in state

### Step 2: Extracting React Hook Form Ref

```typescript
// Extract ref from props if it exists (from React Hook Form)
const { ref: externalRef, ...restProps } = props as any;
```

**What's happening here:**

- React Hook Form passes a `ref` prop to track the field
- Using object destructuring: `{ ref: externalRef, ...restProps }`
- `ref: externalRef` - Extracts `ref` property and renames it to `externalRef`
- `...restProps` - Collects all other props into `restProps` object
- `as any` - TypeScript type assertion (we know props might have a ref, but it's not in the type definition)

**Why we need this:**
If we don't extract the ref, spreading `{...props}` would override our internal ref attachment, causing `containerRef.current` to always be `null`.

### Step 3: Merging Refs with `useCallback`

```typescript
const setRefs = useCallback(
  (node: HTMLDivElement | null) => {
    containerRef.current = node;

    // React Hook Form uses callback refs
    if (typeof externalRef === 'function') {
      externalRef(node);
    }
  },
  [externalRef]
);
```

**What is `useCallback`?**
A React hook that memoizes a function, returning the same function reference between renders unless dependencies change.

**Syntax:**

```typescript
useCallback(
  (parameters) => {
    /* function body */
  },
  [dependencies]
);
```

**Why use it here?**

- Refs can be either objects (`{ current: value }`) or functions
- React calls the function every time the element mounts/unmounts
- Without `useCallback`, we'd create a new function on every render
- Creating a new ref callback function would cause React to call it unnecessarily

**Type breakdown:**

```typescript
(node: HTMLDivElement | null) => void
```

- `node` - The DOM element (or null when unmounting)
- `HTMLDivElement | null` - Can be the div or null
- `=> void` - Function returns nothing

**The callback pattern:**

```typescript
containerRef.current = node; // Set our internal ref
externalRef(node); // Pass to React Hook Form
```

Both refs now point to the same DOM element!

### Step 4: Finding Scrollable Parents

```typescript
// Find the closest scrollable ancestor
let scrollParent = containerRef.current.parentElement;
while (scrollParent) {
  const style = window.getComputedStyle(scrollParent);
  const overflowY = style.overflowY;
  if (overflowY === 'auto' || overflowY === 'scroll') {
    break;
  }
  scrollParent = scrollParent.parentElement;
}
```

**What's happening:**

1. **`parentElement`** - Gets the immediate parent DOM node
2. **`window.getComputedStyle(element)`** - Returns computed CSS styles
   - Not inline styles or stylesheet rules
   - The actual rendered styles after all CSS is applied
3. **`style.overflowY`** - The overflow behavior for vertical scrolling
   - `'auto'` - Shows scrollbar when content overflows
   - `'scroll'` - Always shows scrollbar
   - `'visible'` - No clipping (default)
   - `'hidden'` - Clips content without scrollbar

**The `while` loop:**

```typescript
while (scrollParent) {
  // Check if this element is scrollable
  // If yes: break (we found it!)
  // If no: move to parent and check again
  scrollParent = scrollParent.parentElement;
}
```

**Why we need this:**
To find the container that would clip our dropdown. In our case, it's the `DialogContent` with `overflow-y-auto`.

**After the loop:**

- `scrollParent` is the first scrollable ancestor (or `null` if none found)

### Step 5: Calculating Available Space

```typescript
let spaceBelow: number;
let spaceAbove: number;

if (scrollParent) {
  // Calculate space within the scroll container
  const scrollParentRect = scrollParent.getBoundingClientRect();
  const spaceInContainerBelow = scrollParentRect.bottom - rect.bottom;
  const spaceInContainerAbove = rect.top - scrollParentRect.top;

  // Also consider viewport boundaries
  const spaceInViewportBelow = window.innerHeight - rect.bottom;
  const spaceInViewportAbove = rect.top;

  // Use the more restrictive boundary (minimum available space)
  spaceBelow = Math.min(spaceInContainerBelow, spaceInViewportBelow);
  spaceAbove = Math.min(spaceInContainerAbove, spaceInViewportAbove);
} else {
  // No scroll container, use viewport
  spaceBelow = window.innerHeight - rect.bottom;
  spaceAbove = rect.top;
}
```

**Visual representation:**

```
┌─────────────────────────────────┐ ← Viewport top (0)
│                                 │
│  ┌───────────────────────────┐  │ ← Scroll container top
│  │                           │  │
│  │  ┌─────────────────────┐  │  │ ← SelectMenu top
│  │  │   SelectMenu        │  │  │
│  │  └─────────────────────┘  │  │ ← SelectMenu bottom
│  │                           │  │
│  │  ← spaceBelow (to bottom) │  │
│  │                           │  │
│  └───────────────────────────┘  │ ← Scroll container bottom
│                                 │
└─────────────────────────────────┘ ← Viewport bottom
```

**The math:**

1. **Space below in container:**

   ```typescript
   scrollParentRect.bottom - rect.bottom;
   // Container's bottom edge - SelectMenu's bottom edge = space between
   ```

2. **Space above in container:**

   ```typescript
   rect.top - scrollParentRect.top;
   // SelectMenu's top edge - Container's top edge = space between
   ```

3. **Space below in viewport:**

   ```typescript
   window.innerHeight - rect.bottom;
   // Viewport height - SelectMenu's bottom = space to viewport bottom
   ```

4. **Space above in viewport:**
   ```typescript
   rect.top;
   // Distance from viewport top (which is 0)
   ```

**Why use `Math.min()`?**

```typescript
spaceBelow = Math.min(spaceInContainerBelow, spaceInViewportBelow);
```

We need to respect BOTH boundaries. If the container has 100px of space but the viewport only has 50px, we can only use 50px. The most restrictive boundary wins.

### Step 6: Deciding Direction

```typescript
const estimatedDropdownHeight = 260; // max-h-60 = 240px + padding

const direction =
  spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow
    ? 'up'
    : 'down';

setDropdownDirection(direction);
```

**The logic:**

1. **Condition 1:** `spaceBelow < estimatedDropdownHeight`

   - "Is there NOT enough room below?"
   - If we have 89px below and need 260px, this is `true`

2. **Condition 2:** `spaceAbove > spaceBelow`

   - "Is there MORE room above than below?"
   - If we have 340px above and 89px below, this is `true`

3. **Both must be true:**
   - `true && true = true` → Set to `'up'`
   - Otherwise → Set to `'down'` (default)

**Why this logic?**

- Opening downward is the default (more intuitive)
- Only flip upward when absolutely necessary
- Must have more space above to justify flipping

**Edge cases handled:**

```typescript
// Not enough space below, but also not enough above
spaceBelow: 50px, spaceAbove: 30px
// Result: 'down' (stays default, will scroll if needed)

// Enough space below
spaceBelow: 300px, spaceAbove: 400px
// Result: 'down' (no need to flip)

// Not enough below, more above
spaceBelow: 89px, spaceAbove: 340px
// Result: 'up' (flip it!)
```

---

## TypeScript Type System

### Type Annotations vs Type Inference

**Type Annotation (explicit):**

```typescript
const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>(
  'down'
);
```

**Type Inference (implicit):**

```typescript
const [dropdownDirection, setDropdownDirection] = useState('down');
// TypeScript infers: const dropdownDirection: string
```

**Why we use annotation here:**
Without the generic `<'down' | 'up'>`, TypeScript infers `string`. This allows ANY string:

```typescript
setDropdownDirection('sideways'); // TypeScript won't complain!
```

With the union type:

```typescript
setDropdownDirection('sideways'); // ERROR: Type '"sideways"' is not assignable to type '"down" | "up"'
```

### Union Types

```typescript
type Direction = 'down' | 'up';
```

**What is a union type?**
A type that can be one of several types, separated by `|` (pipe).

**Examples:**

```typescript
// String literals
type Status = 'draft' | 'published' | 'archived';

// Mixed types
type Id = string | number;

// With null
type MaybeUser = User | null;
```

**Why use union types?**

- Type safety: Prevents invalid values
- Autocomplete: IDE suggests valid options
- Self-documenting: Code clearly shows what values are expected

### Function Types

```typescript
const setRefs = useCallback(
  (node: HTMLDivElement | null) => {
    // ...
  },
  [externalRef]
);
```

**Type breakdown:**

```typescript
// Function signature:
(node: HTMLDivElement | null) => void

// Means:
// - Takes one parameter: node (HTMLDivElement or null)
// - Returns: void (nothing)
```

**Alternative syntax:**

```typescript
type RefCallback = (node: HTMLDivElement | null) => void;

const setRefs: RefCallback = useCallback(
  (node) => {
    // TypeScript knows 'node' is HTMLDivElement | null
  },
  [externalRef]
);
```

### Generic Types

```typescript
useRef<HTMLDivElement>(null)
useState<'down' | 'up'>('down')
useCallback<(node: HTMLDivElement | null) => void>((node) => { ... })
```

**What are generics?**
Placeholders for types that get filled in when you use them.

**Think of it like:**

```typescript
function identity<T>(value: T): T {
  return value;
}

// When called:
identity<string>('hello'); // T = string
identity<number>(42); // T = number
```

**Why React hooks use generics:**

```typescript
// Without generic - TypeScript infers poorly
const ref = useRef(null);
// ref.current: null (forever!)

// With generic - We specify what it will hold
const ref = useRef<HTMLDivElement>(null);
// ref.current: HTMLDivElement | null (correct!)
```

### Type Assertions (`as`)

```typescript
const { ref: externalRef, ...restProps } = props as any;
```

**What is `as`?**
Tells TypeScript "trust me, I know the type better than you do."

**Why use it here?**

- Our `props` type doesn't include `ref` (it's not in `SelectMenuProps`)
- But React Hook Form DOES pass a ref
- We know it might be there, so we use `as any` to bypass the type check

**Danger:**

```typescript
const name: string = 123 as any; // No error, but will cause runtime bugs!
```

**Better alternative (if possible):**

```typescript
interface PropsWithRef extends SelectMenuProps {
  ref?: React.Ref<HTMLDivElement>;
}

const { ref: externalRef, ...restProps } = props as PropsWithRef;
```

---

## React Hooks Explained

### `useState` - State Management

**Signature:**

```typescript
function useState<S>(initialState: S): [S, Dispatch<SetStateAction<S>>];
```

**What it returns:**

```typescript
const [value, setValue] = useState(initialValue);
// value: S (current state)
// setValue: (newValue: S) => void
```

**How it works:**

1. First render: Returns `initialValue`
2. Call `setValue(newValue)`: Schedules re-render with new value
3. Next render: Returns `newValue`

**Important rules:**

- State updates are asynchronous
- Multiple `setState` calls in the same event are batched
- Don't mutate state directly: `setValue(newValue)`, not `value = newValue`

### `useRef` - Mutable References

**Signature:**

```typescript
function useRef<T>(initialValue: T): MutableRefObject<T>;
```

**What it returns:**

```typescript
const ref = useRef(initialValue);
// ref: { current: T }
```

**Key differences from state:**

| Feature                  | `useState`         | `useRef`                 |
| ------------------------ | ------------------ | ------------------------ |
| Triggers re-render       | ✅ Yes             | ❌ No                    |
| Mutable                  | ❌ No (create new) | ✅ Yes (mutate directly) |
| Persists between renders | ✅ Yes             | ✅ Yes                   |
| Use case                 | UI state           | DOM access, timers       |

**Example:**

```typescript
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1; // Won't cause re-render
  console.log(`Rendered ${renderCount.current} times`);
});
```

### `useEffect` - Side Effects

**Signature:**

```typescript
function useEffect(
  effect: () => void | (() => void),
  deps?: DependencyList
): void;
```

**What it does:**
Runs side effects after render (DOM mutations, subscriptions, timers, etc.)

**Example:**

```typescript
useEffect(
  () => {
    // Setup: runs after render
    const handler = (e) => console.log(e);
    document.addEventListener('click', handler);

    // Cleanup: runs before next effect and on unmount
    return () => {
      document.removeEventListener('click', handler);
    };
  },
  [
    /* dependencies */
  ]
);
```

**Dependency array:**

```typescript
useEffect(() => {}, []); // Run once (mount)
useEffect(() => {}, [count]); // Run when count changes
useEffect(() => {}); // Run on every render
```

**In our code:**

```typescript
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]); // Only re-run when isOpen changes
```

**Why the cleanup?**
Without it, we'd add a new event listener on every render but never remove old ones (memory leak!).

### `useCallback` - Memoized Functions

**Signature:**

```typescript
function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
```

**What it does:**
Returns a memoized version of the callback that only changes if dependencies change.

**Without `useCallback`:**

```typescript
function Component() {
  const handleClick = () => console.log('clicked');
  // New function created on every render!

  return <ChildComponent onClick={handleClick} />;
}
```

**With `useCallback`:**

```typescript
function Component() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Same function reference every render

  return <ChildComponent onClick={handleClick} />;
}
```

**Why we use it for refs:**

```typescript
const setRefs = useCallback(
  (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof externalRef === 'function') {
      externalRef(node);
    }
  },
  [externalRef]
);
```

React calls the ref callback when:

1. Component mounts (node = element)
2. Component unmounts (node = null)
3. Ref callback changes (old callback with null, new callback with element)

Without `useCallback`, the ref function would be "new" every render, causing unnecessary calls.

---

## CSS & Animation System

### CVA (Class Variance Authority)

**What is CVA?**
A utility for building type-safe variant-based class names.

**Basic structure:**

```typescript
const menuVariants = cva(
  'base classes here', // Always applied
  {
    variants: {
      variantName: {
        variantValue: 'classes for this value',
      },
    },
    compoundVariants: [
      {
        condition1: value1,
        condition2: value2,
        className: 'classes when both conditions match',
      },
    ],
    defaultVariants: {
      variantName: 'defaultValue',
    },
  }
);
```

**Our implementation:**

```typescript
const menuVariants = cva(
  // Base classes (always applied)
  'absolute z-50 w-full bg-surface-container rounded-[4px] shadow-elevation-2 max-h-60 overflow-y-auto',
  {
    variants: {
      // When open/closed
      open: {
        true: '',
        false: 'opacity-0 pointer-events-none invisible',
      },
      // Direction variants
      direction: {
        down: 'top-full mt-1 origin-top',
        up: 'bottom-full mb-1 origin-bottom',
      },
    },
    // Compound variants (multiple conditions)
    compoundVariants: [
      {
        open: true,
        direction: 'down',
        className: 'animate-dropdown-fade-in',
      },
      {
        open: true,
        direction: 'up',
        className: 'animate-dropdown-fade-in-up',
      },
    ],
    defaultVariants: {
      open: false,
      direction: 'down',
    },
  }
);
```

**How to use:**

```typescript
const className = menuVariants({
  open: isOpen,
  direction: dropdownDirection,
});

// When isOpen=true, direction='up':
// Result: "absolute z-50 w-full ... bottom-full mb-1 origin-bottom animate-dropdown-fade-in-up"
```

### Positioning Classes

**`absolute`**

- Element is removed from normal document flow
- Positioned relative to nearest positioned ancestor (or viewport if none)

**`top-full`**

```css
top: 100%;
```

- Positions element's top edge at the parent's bottom edge
- Used for dropdown opening downward

**`bottom-full`**

```css
bottom: 100%;
```

- Positions element's bottom edge at the parent's top edge
- Used for dropdown opening upward

**Visual:**

```
direction: 'down'              direction: 'up'
┌────────────────┐             ┌────────────────┐
│ SelectMenu     │             │   Dropdown     │
└────────────────┘             │   ↑            │
 ↓ top-full mt-1               └────────────────┘
┌────────────────┐              bottom-full mb-1
│   Dropdown     │             ┌────────────────┐
│                │             │ SelectMenu     │
└────────────────┘             └────────────────┘
```

### Transform Origin

**`origin-top`**

```css
transform-origin: top center;
```

- Transformations (scale, rotate) happen from the top
- For downward dropdown: scales from top to bottom

**`origin-bottom`**

```css
transform-origin: bottom center;
```

- Transformations happen from the bottom
- For upward dropdown: scales from bottom to top

**Why this matters:**

```css
/* Without correct origin */
origin-top + opening upward = scales wrong direction (looks janky)

/* With correct origin */
origin-bottom + opening upward = scales from bottom (looks smooth)
```

### Tailwind Animations

**Keyframes definition (tailwind.config.ts):**

```typescript
keyframes: {
  'dropdown-fade-in': {
    '0%': {
      opacity: '0',
      transform: 'translateY(-8px) scaleY(0.95)',
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0) scaleY(1)',
    },
  },
  'dropdown-fade-in-up': {
    '0%': {
      opacity: '0',
      transform: 'translateY(8px) scaleY(0.95)',
    },
    '100%': {
      opacity: '1',
      transform: 'translateY(0) scaleY(1)',
    },
  },
}
```

**Animation definition:**

```typescript
animation: {
  'dropdown-fade-in': 'dropdown-fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  'dropdown-fade-in-up': 'dropdown-fade-in-up 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
}
```

**Breaking down the animation:**

1. **Name:** `dropdown-fade-in`
2. **Duration:** `0.25s` (250 milliseconds)
3. **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design easing curve)

**Easing curves:**

```
cubic-bezier(0.4, 0, 0.2, 1) = "ease-out"
- Starts fast
- Ends slowly
- Feels natural
```

**Transform breakdown:**

```css
/* Opening downward */
transform: translateY(-8px) scaleY(0.95);
/* 
  translateY(-8px) = move 8px upward
  scaleY(0.95) = squish to 95% height
  Combined: starts slightly above and smaller
*/

/* Opening upward */
transform: translateY(8px) scaleY(0.95);
/* 
  translateY(8px) = move 8px downward
  scaleY(0.95) = squish to 95% height
  Combined: starts slightly below and smaller
*/
```

---

## Material Design 3 Principles

### Menu Positioning Guidelines

From Material Design 3 documentation:

1. **Menu Position**

   - Menus appear next to or in front of the element that generates them
   - Default: Below and aligned with trigger element

2. **Boundary Awareness**

   - If a menu would be cut off, it automatically repositions
   - Can move left, right, or above the trigger element

3. **Screen Edge Behavior**

   - Opened at top of screen → expands downward
   - Opened at bottom of screen → expands upward
   - Ensures menu remains fully visible

4. **Container Boundaries**
   - Menus respect scroll container boundaries
   - Don't extend beyond dialogs, modals, or scrollable areas

### Implementation Alignment

Our implementation follows these principles:

```typescript
// 1. Default position: below element
direction: 'down'
className: 'top-full mt-1 origin-top'

// 2. Boundary detection
const scrollParent = findScrollableParent(element);
const viewportBounds = window.innerHeight;

// 3. Automatic repositioning
if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
  direction = 'up'; // Flip upward
}

// 4. Smooth animation based on direction
{
  open: true,
  direction: 'up',
  className: 'animate-dropdown-fade-in-up'
}
```

---

## Debugging Journey

### Issue 1: Ref Always Null

**Symptom:**

```
handleToggle called
containerRef.current: null
```

**Root cause:**

```typescript
<SelectMenu {...field} /> // React Hook Form spreads a 'ref' prop
```

React Hook Form's `field.ref` was overwriting our internal ref!

**Solution:**

```typescript
// Extract external ref from props
const { ref: externalRef, ...restProps } = props as any;

// Create merged ref callback
const setRefs = useCallback((node: HTMLDivElement | null) => {
  containerRef.current = node;           // Our internal ref
  if (typeof externalRef === 'function') {
    externalRef(node);                   // React Hook Form's ref
  }
}, [externalRef]);

// Use merged ref
<div ref={setRefs} {...restProps}>
```

**Lesson learned:**

- Always consider prop spreading (`{...props}`)
- Check for conflicting prop names (especially `ref`, `key`, `className`)
- Use merged/forwarded refs when integrating with libraries

### Issue 2: Timing - Ref Set Too Late

**Symptom:**

```typescript
const willBeOpen = true;
console.log(containerRef.current); // null
```

**Root cause:**

```typescript
setIsOpen(true); // Schedules re-render
// Immediately after:
if (containerRef.current) {
  // Still null! Re-render hasn't happened yet
  // ...
}
```

**Why?**

- State updates are asynchronous
- React batches updates for performance
- Ref gets set during the render phase
- Our code runs before render completes

**Solution:**

```typescript
setIsOpen(true);

// Wait for next animation frame (after render + paint)
requestAnimationFrame(() => {
  if (!containerRef.current) return;

  // Now ref is guaranteed to be set
  const rect = containerRef.current.getBoundingClientRect();
  // ...
});
```

**Alternatives we didn't use:**

```typescript
// Option 1: useLayoutEffect (runs after render but before paint)
useLayoutEffect(() => {
  if (isOpen && containerRef.current) {
    // Calculate positioning
  }
}, [isOpen]);
// Problem: Setting state in useLayoutEffect triggers warnings

// Option 2: Callback ref
const setRefs = (node) => {
  if (node) {
    // Calculate positioning here
  }
};
// Problem: Runs every time ref changes, not when opening
```

**Lesson learned:**

- Understand React's rendering lifecycle
- Use `requestAnimationFrame` for post-render DOM access
- State updates → Render → Commit → Paint → rAF callback

### Issue 3: Wrong Animation Direction

**Symptom:**
Dropdown opening upward looked weird (seemed to slide the wrong way).

**Root cause:**

```typescript
// Same animation for both directions
open: true → 'animate-dropdown-fade-in'

// Animation starts with:
transform: translateY(-8px) // Moves UP
```

When opening upward, starting with "move up" looks backwards!

**Solution:**

```typescript
// Different animations based on direction
compoundVariants: [
  {
    open: true,
    direction: 'down',
    className: 'animate-dropdown-fade-in',     // translateY(-8px)
  },
  {
    open: true,
    direction: 'up',
    className: 'animate-dropdown-fade-in-up',  // translateY(8px)
  },
]

// New keyframe for upward opening
'dropdown-fade-in-up': {
  '0%': { transform: 'translateY(8px) scaleY(0.95)' }, // Start below
  '100%': { transform: 'translateY(0) scaleY(1)' },     // Move to position
}
```

**Lesson learned:**

- Match animations to their context
- Transform direction should match visual direction
- Origin point matters for scale/rotation

---

## Best Practices

### 1. Type Safety

**Do:**

```typescript
// Explicit union types for limited values
const [direction, setDirection] = useState<'up' | 'down'>('down');

// Proper generic annotations
const ref = useRef<HTMLDivElement>(null);

// Interface over type for extensibility
interface SelectMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  options: SelectMenuOption[];
}
```

**Don't:**

```typescript
// Overly broad types
const [direction, setDirection] = useState('down'); // Type: string

// Using 'any' unnecessarily
const ref = useRef<any>(null);

// Inline types (hard to reuse)
function SelectMenu(props: {
  label: string;
  options: { value: string; label: string }[];
}) {
  // ...
}
```

### 2. Ref Management

**Do:**

```typescript
// Check ref before using
if (containerRef.current) {
  const rect = containerRef.current.getBoundingClientRect();
}

// Merge refs when needed
const setRefs = useCallback(
  (node) => {
    internalRef.current = node;
    if (externalRef) externalRef(node);
  },
  [externalRef]
);
```

**Don't:**

```typescript
// Assume ref is always set
const rect = containerRef.current.getBoundingClientRect(); // Might crash!

// Ignore external refs
<div ref={internalRef} {...props}> // Overwrites external ref!
```

### 3. Effect Dependencies

**Do:**

```typescript
// Include all dependencies
useEffect(() => {
  if (isOpen && containerRef.current) {
    // ...
  }
}, [isOpen]); // Include everything used inside

// Empty array for mount-only
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

**Don't:**

```typescript
// Missing dependencies
useEffect(() => {
  console.log(count); // count not in deps!
}, []);

// Unnecessary dependencies
useEffect(() => {
  console.log('Hello');
}, [count]); // count not used, effect runs unnecessarily
```

### 4. State Updates

**Do:**

```typescript
// Functional updates when depending on previous state
setCount((prev) => prev + 1);

// Batch related updates
const handleOpen = () => {
  setIsOpen(true);
  setDirection('down');
  // Both updates batched into one render
};
```

**Don't:**

```typescript
// Multiple reads of state in same event
setCount(count + 1);
setCount(count + 1); // Uses old count! Result: +1, not +2

// Unnecessary state
const [fullName, setFullName] = useState(''); // Don't!
// Derive instead:
const fullName = `${firstName} ${lastName}`;
```

### 5. Performance Optimization

**Do:**

```typescript
// Memoize expensive calculations
const sortedOptions = useMemo(
  () => options.sort((a, b) => a.label.localeCompare(b.label)),
  [options]
);

// Memoize callbacks passed to children
const handleSelect = useCallback(
  (value) => {
    onChange(value);
  },
  [onChange]
);
```

**Don't:**

```typescript
// Calculate on every render
const sortedOptions = options.sort(...); // Sorts every render!

// New function every render
const handleSelect = (value) => onChange(value); // New function = child re-renders
```

### 6. Accessibility

**Do:**

```typescript
// Proper ARIA attributes
<div
  role="listbox"
  aria-expanded={isOpen}
  aria-labelledby={labelId}
  aria-describedby={errorId}
>

// Keyboard navigation
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleToggle();
  }
}}
```

**Don't:**

```typescript
// Missing roles
<div> // Screen readers won't understand this is a menu

// Click-only interactions
onClick={handleToggle} // Keyboard users can't access
```

---

## Summary

### Key Takeaways

1. **Refs for DOM Access**

   - Use `useRef` to access DOM elements
   - Check for `null` before using
   - Merge refs when integrating with libraries

2. **Timing Matters**

   - State updates are asynchronous
   - Use `requestAnimationFrame` for post-render work
   - Understand render → commit → paint cycle

3. **Type Safety Prevents Bugs**

   - Use union types for limited values
   - Annotate generics explicitly
   - Avoid `any` except when necessary

4. **Animations Need Context**

   - Match animation to visual direction
   - Consider transform origin
   - Test all animation states

5. **Boundary Detection is Complex**
   - Check both scroll containers and viewport
   - Use most restrictive boundary
   - Handle edge cases (no parent, multiple containers)

### Architecture Decisions

| Decision              | Reason                             | Alternative Considered                   |
| --------------------- | ---------------------------------- | ---------------------------------------- |
| Smart positioning     | Better UX, follows Material Design | Fixed positioning (simpler but worse UX) |
| requestAnimationFrame | Ensures DOM is ready               | useLayoutEffect (causes warnings)        |
| Merged refs           | Support React Hook Form            | Separate wrapper component               |
| CVA for variants      | Type-safe class names              | Manual string concatenation              |
| Compound variants     | Different animations per direction | Single animation with CSS variables      |

### Files Modified

1. **`select-menu.tsx`** - Component implementation

   - Added state for direction
   - Ref merging logic
   - Smart positioning algorithm
   - Updated CVA variants

2. **`tailwind.config.ts`** - Animation system
   - New keyframe: `dropdown-fade-in-up`
   - Animation definition

### Testing Checklist

- [ ] Dropdown opens downward when plenty of space
- [ ] Dropdown flips upward when near bottom
- [ ] Animation looks smooth in both directions
- [ ] Works inside scrollable containers
- [ ] Works with React Hook Form
- [ ] Keyboard accessible
- [ ] Screen reader announces correctly
- [ ] Handles window resize
- [ ] Closes on outside click
- [ ] Closes on Escape key

---

## Additional Resources

- [React Refs Documentation](https://react.dev/learn/referencing-values-with-refs)
- [React Hooks Reference](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Material Design 3 - Menus](https://m3.material.io/components/menus/overview)
- [MDN: getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [CVA Documentation](https://cva.style/docs)
