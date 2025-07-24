import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordResetSchema } from '../../validation/auth-schema';
import { PasswordResetFormData } from '../types/password-reset-form-data';

export const usePasswordResetForm = () => {
  const searchParams = useSearchParams();
  const defaultEmail = decodeURIComponent(searchParams.get('email') ?? '');
  return useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });
};
