'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { register as registerApi } from '@entities/user';
import { ApiError } from '@shared/api';
import { ROUTES } from '@shared/config';
import { useAuthStore } from '@shared/store';
import { toast } from '@shared/ui';

import type { RegisterValues } from './auth.schema';

interface UseRegister {
  submit: (values: RegisterValues) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

// Регистрация создаёт клиента и сразу логинит — редирект на главную.
export const useRegister = (): UseRegister => {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: RegisterValues): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      // confirmPassword — поле только формы, в API не уходит.
      const { token, user } = await registerApi({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setSession({ token, user });
      toast.success('Аккаунт создан');
      router.replace(ROUTES.home);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : 'Не удалось зарегистрироваться',
      );
    } finally {
      setIsPending(false);
    }
  };

  return { submit, isPending, error };
};
