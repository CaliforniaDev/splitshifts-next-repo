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

/**
 * The `TextField` component is a reusable input field that supports labels, error messages,
 * supporting text, and accessibility features. It manages focus and populated states to
 * provide visual feedback and ensure accessibility compliance.
 *
 * **Features:**
 * - Controlled and uncontrolled usage
 * - Accessible labels and error descriptions
 * - Dynamic styling based on focus and error states
 * - Support for disabling the input
 *
 * **Usage:**
 * ```jsx
 * <TextField
 *   label="Username"
 *   name="username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 *   error={usernameError}
 *   supportingText="Enter your unique username."
 *   required
 * />
 * ```
 *
 * **Props:**
 * - `label` (string): The label for the text field.
 * - `value` (optional, string): The current value of the text field.
 * - `name` (string): The name attribute for the input element.
 * - `onChange` (optional, function): Callback fired when the value changes.
 * - `className` (optional, string): Additional CSS classes for the input.
 * - `disabled` (optional, boolean): Disables the input if `true`.
 * - `error` (optional, boolean|string): Indicates an error state or provides an error message.
 * - `supportingText` (optional, string): Additional text displayed below the input.
 * - `required` (optional, boolean): Marks the input as required.
 * - `style` (optional, React.CSSProperties): Inline styles for the input.
 *
 * @param {TextFieldProps} props The props for the TextField component.
 * @returns The rendered TextField component with label, input, and optional messages.
 */

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
