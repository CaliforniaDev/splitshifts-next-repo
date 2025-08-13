import React from 'react';

interface DashboardIconProps {
  className?: string;
  variant?: 'solid' | 'outline';
}

export function EmployeesIcon({ className = 'h-6 w-6', variant = 'outline' }: DashboardIconProps) {
  if (variant === 'solid') {
    return (
      <svg 
        className={className} 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" fillRule="evenodd" d="M8.25 6.375a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.375a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.375a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 14.742A6.745 6.745 0 0 1 12 11.625a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.375c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd"/>
        <path fill="currentColor" d="M5.082 13.879a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.014a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"/>
      </svg>
    );
  }
  
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 18.344a9.094 9.094 0 0 0 3.74-.478 3 3 0 0 0-4.682-2.72M18 18.345v.031c0 .225-.012.447-.036.666a11.944 11.944 0 0 1-5.964 1.584c-2.17 0-4.206-.576-5.963-1.584a6.062 6.062 0 0 1-.037-.697m12 0a5.971 5.971 0 0 0-.94-3.197m0 0a5.995 5.995 0 0 0-5.06-2.772 5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.941-3.197A5.971 5.971 0 0 0 6 18.344m9-11.969a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
    </svg>
  );
}
