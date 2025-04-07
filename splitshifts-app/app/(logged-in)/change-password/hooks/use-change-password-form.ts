import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordData } from '../types/change-password-data';
import { changePasswordSchema } from '../validation/change-password-schema';

export const useChangePasswordForm = () => {
  return useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirm: '',
    }
  });
}