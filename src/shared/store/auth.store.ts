import { create } from 'zustand';

import type { AuthUser } from '@shared/types';

// Стор авторизации. Токен ТОЛЬКО в памяти (ТЗ, п. 5): localStorage уязвим
// к XSS, поэтому сброс сессии при перезагрузке страницы — осознанный
// компромисс этапа без бэкенда. Persist-механизмы не подключать.

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (session: { token: string; user: AuthUser }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}));
