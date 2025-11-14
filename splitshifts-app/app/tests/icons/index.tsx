// Individual icon exports
export { DocumentTextIcon } from './document-text-icon';
export { PuzzleIcon } from './puzzle-icon';

// Types
export interface TestIconProps {
  className?: string;
  variant?: 'solid' | 'outline';
}

// Icon names type for type safety
export type TestIconName = 'document-text' | 'puzzle';

// Test navigation items type
export interface TestNavItem {
  name: string;
  href: string;
  icon: TestIconName;
  description?: string;
}
