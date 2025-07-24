import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '../../validation/auth-schema';
import { LoginFormData } from '../types/login-form-data';

export const useLoginForm = () => {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
};
