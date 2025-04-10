import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../../validation/auth-schema';
import { ResetPasswordFormData } from '../types/reset-password-form-data';

export const useResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const defaultEmail = decodeURIComponent(searchParams.get('email') ?? '');
  return useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });
};
