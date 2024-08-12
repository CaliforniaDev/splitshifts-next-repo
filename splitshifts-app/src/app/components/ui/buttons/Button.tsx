/**
 * Button component
 *
 * This component renders a button with different styles based on the `variant` prop.
 *
 * Props:
 * - `variant` (string): The style variant of the button. Can be 'outlined' or 'text'.
 * - `disabled` (boolean): If true, the button will be disabled.
 * - `onClick` (function): The function to call when the button is clicked.
 * - `children` (ReactNode): The content to display inside the button.
 *
 * Example usage:
 * ```jsx
 * <Button variant="outlined" onClick={() => console.log('Button clicked!')}>
 *   Click Me
 * </Button>
 * ```
 */

type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';

type ButtonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  variant = 'filled',
  children = 'Button',
  disabled = false,
  onClick,
}: ButtonProps) {
  const baseStyle =
    'typescale-label-large whitespace-nowrap rounded-[10px] px-6 py-2.5 focus:outline-none ';

  const styles = {
    elevated: 'shadow-elevation-1 bg-surface-container-low text-on-surface',
    filled: 'bg-primary text-on-primary',
    tonal: 'bg-secondary-container text-on-secondary-container',
    outlined: 'border border-outline text-primary',
    text: 'text-primary',
  };

  return (
    <button
      className={`${baseStyle} ${styles[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
