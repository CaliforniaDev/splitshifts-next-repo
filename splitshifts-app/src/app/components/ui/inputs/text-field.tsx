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
  value = '',
  name,
  onChange,
  className,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  let isPopulated = value !== '';
  const id = props.id || name;
  const errorId = `${id}-error`;
  const supportingTextId = `${id}-supporting-text`;
  const describedByIds = [];
  if (errorId) describedByIds.push(errorId);
  if (supportingTextId) describedByIds.push(supportingTextId);

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
          // aria-invalid={!!error}
          aria-describedby={
            describedByIds.length > 0 ? describedByIds.join(' ') : undefined
          }
          {...props}
          className={clsx(styles.inputBase, className, {
            'border-b-2 border-b-primary': isFocused, // && !error,w
            'border-b-[1px] border-b-on-surface': !isFocused,
            // 'border-b-error': error,
          })}
        />
        <label
          htmlFor={id}
          className={clsx(styles.labelBase, {
            'text-primary': isFocused, // && !error,
            'text-on-surface-variant': !isFocused,
            'typescale-body-large pt-4': !isFocused && !isPopulated,
            'typescale-body-small pt-[8px]': isFocused || isPopulated,
            // 'text-on-error-container': error,
          })}
        >
          {label}
        </label>
      </span>
    </div>
  );
}
