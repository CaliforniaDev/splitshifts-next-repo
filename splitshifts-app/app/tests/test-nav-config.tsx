import type { TestIconName } from './icons';

/**
 * Test Navigation Item Interface
 * 
 * Defines the structure for test page navigation items.
 */
export interface TestNavItem {
  name: string;
  href: string;
  icon: TestIconName;
  description: string;
}

/**
 * Test Navigation Configuration
 * 
 * Static configuration for test page navigation items.
 */
export const testNavigation: TestNavItem[] = [
  {
    name: 'UI Components',
    href: '/tests/components',
    icon: 'puzzle',
    description: 'Buttons, Inputs, Cards, Forms',
  },
  {
    name: 'Form Examples',
    href: '/tests/forms',
    icon: 'document-text',
    description: 'Onboarding Form Components',
  },
];
