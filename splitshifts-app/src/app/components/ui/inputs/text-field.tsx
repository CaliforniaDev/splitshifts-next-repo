'use client';
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
  value,
  name,
  onChange,
  className,
  ...props
}: TextFieldProps) {
  const id = props.id || name;
  return (
    <div className='relative'>
      <div
        className={clsx(
          styles.hoverStateLayer,
          'relative w-full text-on-surface-variant',
        )}
      >
        <input
          id={id}
          value={value}
          name={name}
          onChange={onChange}
          className={clsx(
            className,
            'relative h-14 rounded-t-[4px] border-b-[1px] border-on-surface bg-surface-container-highest',
          )}
          {...props}
        />
        {/**
         * TODO: Add label styling
         */}
        <label htmlFor={id} className=''>
          {label}
        </label>
      </div>
    </div>
  );
}
