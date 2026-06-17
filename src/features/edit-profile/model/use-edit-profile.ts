'use client';

import { useState } from 'react';

import { updateProfile, type User } from '@entities/user';
import { ApiError } from '@shared/api';
import { useAuthStore } from '@shared/store';
import { toast } from '@shared/ui';

import type { ProfileValues } from './profile.schema';

interface UseEditProfile {
  submit: (values: ProfileValues) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

// Сохранение профиля: обновляем на сервере (мок), синхронизируем стор сессии
// (чтобы имя в шапке и т.п. оставались актуальны) и сообщаем тостом.
export const useEditProfile = (
  onSaved?: (user: User) => void,
): UseEditProfile => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: ProfileValues): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      const updated = await updateProfile({
        name: values.name,
        // Пустую строку трактуем как «телефон не указан».
        phone: values.phone ? values.phone : undefined,
      });
      const token = useAuthStore.getState().token;
      if (token) {
        useAuthStore.getState().setSession({ token, user: updated });
      }
      toast.success('Профиль обновлён');
      onSaved?.(updated);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : 'Не удалось сохранить профиль',
      );
    } finally {
      setIsPending(false);
    }
  };

  return { submit, isPending, error };
};
