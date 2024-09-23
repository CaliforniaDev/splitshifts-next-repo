'use client';
import { useState, useId } from 'react';
import clsx from 'clsx';
import styles from './text-field.module.css';

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
  value = '',
  name,
  onChange,
  className,
  error,
  supportingText,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  let isPopulated = value !== '';

  // Generate a unique ID for the if one is not provided
  const generatedId = useId();
  const id = props.id || `${name}-${generatedId}`;

  // Handlers to manage focus state
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Accessibility IDs for error and supporting text
  const errorId = `${id}-error`;
  const supportingTextId = `${id}-supporting-text`;

  // Collect IDs for aria-describedby to associate input with descriptions
  const describedByIds = [];
  if (errorId) describedByIds.push(errorId);
  if (supportingTextId) describedByIds.push(supportingTextId);

  // Classes for input and label elements
  const inputClasses = clsx(styles.inputBase, className, {
    'border-b-[1px]': !isFocused,
    'border-b-2': isFocused,
    'border-b-on-surface': !isFocused && !error,
    'border-b-primary caret-primary': isFocused && !error,
    'border-b-error caret-error': error,
  });

  const labelClasses = clsx(styles.labelBase, {
    'typescale-body-large pt-4': !isFocused && !isPopulated,
    'typescale-body-small pt-[8px]': isFocused || isPopulated,
    'text-on-surface-variant': !isFocused && !error,
    'text-primary': isFocused && !error,
    'text-error': error,
  });

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
          aria-invalid={!!error}
          aria-required={props.required ? true : undefined}
          aria-describedby={
            describedByIds.length > 0 ? describedByIds.join(' ') : undefined
          }
          disabled={props.disabled}
          className={inputClasses}
          {...props}
        />
        <label htmlFor={id} className={labelClasses}>
          {label}
          {props.required && <span aria-hidden='true'>*</span>}
        </label>
      </span>
      {supportingText && !error && (
        <p
          id={supportingTextId}
          className='typescale-body-small px-4 pb-0 pt-1'
        >
          {supportingText}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className='typescale-body-small px-4 pb-0 pt-1 text-error'
        >
          {typeof error === 'string' ? error : 'There is an error'}
        </p>
      )}
    </div>
  );
}
