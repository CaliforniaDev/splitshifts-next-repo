import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { passwordMatchSchema } from '@/app/(public)/(auth)/validation/auth-schema';
import type { UpdatePasswordData } from '../types/update-password-form-data';

export const useUpdatePasswordForm = () => {
  return useForm<UpdatePasswordData>({
    resolver: zodResolver(passwordMatchSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });
};
