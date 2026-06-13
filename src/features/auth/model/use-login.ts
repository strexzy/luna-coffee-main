'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { login } from '@entities/user';
import { ApiError } from '@shared/api';
import { getRoleHomePath } from '@shared/config';
import { useAuthStore } from '@shared/store';
import { toast } from '@shared/ui';

import type { LoginValues } from './auth.schema';

interface UseLogin {
  submit: (values: LoginValues) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

// Логика входа: вызов API, запись сессии, редирект на стартовую страницу роли.
// Состояния загрузки/ошибки держим здесь, UI остаётся тонким (соглашения).
export const useLogin = (): UseLogin => {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: LoginValues): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      const { token, user } = await login(values);
      setSession({ token, user });
      toast.success(`Добро пожаловать, ${user.name}`);
      router.replace(getRoleHomePath(user.role));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось войти');
    } finally {
      setIsPending(false);
    }
  };

  return { submit, isPending, error };
};
