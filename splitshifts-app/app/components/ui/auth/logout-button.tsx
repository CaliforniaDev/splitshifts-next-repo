'use client';

import Button from '@/app/components/ui/buttons/button';
import type { ButtonProps } from '@/app/components/ui/buttons/button';
import { logOut } from '@/app/(auth)/actions/logout';

interface LogoutButtonProps
  extends Pick<ButtonProps, 'className' | 'variant' | 'size' | 'disabled'> {
  children: React.ReactNode;
}

export default function LogoutButton({
  children,
  className,
  variant,
  size,
  disabled,
}: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (e) {
      console.error('Failed to log out', e);
    }
  };
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleLogout}
    >
      {children}
    </Button>
  );
}
