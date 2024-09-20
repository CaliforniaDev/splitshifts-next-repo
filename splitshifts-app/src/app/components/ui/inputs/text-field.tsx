'use client';
import clsx from 'clsx';
import styles from './text-field.module.css';
import { useState } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  name: string;
  className?: string;
  disabled?: boolean;
  error?: boolean | string;
  supportingText?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

export default function TextField({
  label,
  value,
  name,
  onChange,
  className,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = props.id || name;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className='relative'>
      <span className={clsx(styles.hoverStateLayer, 'relative block w-full')}>
        <input
          id={id}
          value={value}
          name={name}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
          className={clsx(
            'relative h-14 w-full rounded-t-[4px] bg-surface-container-highest px-4 pb-2 pt-6 text-on-surface caret-primary transition-textfield duration-200 ease-in focus:outline-none',
            {
              className,
              'border-b-2 border-b-primary': isFocused,
              'border-b-[1px] border-b-on-surface': !isFocused,
            },
          )}
        />
        {/**
         * TODO: Add label styling
         */}
        <label
          htmlFor={id}
          className={clsx(
            'pointer-events-none absolute left-4 right-4 text-left transition-all duration-300 ease-in-out',
            {
              'typescale-body-small pt-[8px] text-primary':
                isFocused || value !== '',
              'typescale-body-large pt-4 text-on-surface-variant':
                !isFocused || value === '',
            },
          )}
        >
          {label}
        </label>
      </span>
    </div>
  );
}
