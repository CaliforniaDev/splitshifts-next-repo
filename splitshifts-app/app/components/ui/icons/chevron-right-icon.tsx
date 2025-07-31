import React from 'react';

interface ChevronRightIconProps {
  className?: string;
}

export default function ChevronRightIcon({ className = 'h-4 w-4' }: ChevronRightIconProps) {
  return (
    <svg
      className={className}
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 5l7 7-7 7'
      />
    </svg>
  );
}
