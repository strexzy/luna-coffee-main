import { apiInstance, ApiError, withDelay } from '@shared/api';
import { USE_MOCKS } from '@shared/config';
import { useAuthStore } from '@shared/store';

import type { LoginPayload, LoginResponse, User } from '../model/types';
import {
  MOCK_PASSWORD,
  MOCK_USERS,
  makeMockToken,
  parseMockToken,
} from './user.mock';

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  if (USE_MOCKS) {
    const user = MOCK_USERS.find((u) => u.email === payload.email);
    // Единое сообщение для неверного email и пароля — не раскрываем,
    // что именно не совпало (базовая практика безопасности).
    if (!user || payload.password !== MOCK_PASSWORD) {
      throw new ApiError('Неверный email или пароль', 401);
    }
    return withDelay({ token: makeMockToken(user.id), user });
  }
  const { data } = await apiInstance.post<LoginResponse>(
    '/auth/login',
    payload,
  );
  return data;
};

export const getProfile = async (): Promise<User> => {
  if (USE_MOCKS) {
    // Реальный getProfile опознаёт пользователя по токену из заголовка
    // (его подставляет перехватчик). В моке читаем тот же токен из стора.
    const token = useAuthStore.getState().token;
    const userId = token ? parseMockToken(token) : null;
    const user = userId ? MOCK_USERS.find((u) => u.id === userId) : undefined;
    if (!user) {
      throw new ApiError('Не авторизован', 401);
    }
    return withDelay(user);
  }
  const { data } = await apiInstance.get<User>('/auth/profile');
  return data;
};
