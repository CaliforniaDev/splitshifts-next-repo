import React from 'react';
import { DocumentTextIcon } from './document-text-icon';
import { PuzzleIcon } from './puzzle-icon';
import type { TestIconName, TestIconProps } from './index';

interface TestIconPickerProps extends TestIconProps {
  name: TestIconName;
}

/**
 * Test Icon Picker Component
 * 
 * Centralized icon picker for test navigation.
 * Returns the appropriate icon component based on the name prop.
 */
export function TestIcon({ name, variant = 'outline', className = 'h-6 w-6' }: TestIconPickerProps) {
  const iconProps = { variant, className };

  switch (name) {
    case 'document-text':
      return <DocumentTextIcon {...iconProps} />;
    case 'puzzle':
      return <PuzzleIcon {...iconProps} />;
    default:
      return null;
  }
}
