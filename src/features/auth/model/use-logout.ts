'use client';

import { useRouter } from 'next/navigation';

import { logout } from '@entities/user';
import { ROUTES } from '@shared/config';
import { useAuthStore } from '@shared/store';

// Выход: гасим сессию на сервере (мок — no-op), чистим память, уводим на вход.
export const useLogout = (): (() => Promise<void>) => {
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  return async () => {
    try {
      await logout();
    } finally {
      // Чистим сессию и редиректим даже если запрос logout упал —
      // локальный выход важнее ответа сервера.
      clearSession();
      router.replace(ROUTES.login);
    }
  };
};
