import { apiInstance, ApiError, withDelay } from '@shared/api';
import { USE_MOCKS } from '@shared/config';
import { useAuthStore } from '@shared/store';

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
} from '../model/types';
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

export const register = async (
  payload: RegisterPayload,
): Promise<LoginResponse> => {
  if (USE_MOCKS) {
    if (MOCK_USERS.some((u) => u.email === payload.email)) {
      throw new ApiError('Пользователь с таким email уже существует', 409);
    }
    // Регистрация создаёт клиента. В моке держим его в памяти на время
    // сессии (сбрасывается на перезагрузке вместе со стором — без бэка
    // персистентности нет).
    const user: User = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: 'client',
    };
    MOCK_USERS.push(user);
    return withDelay({ token: makeMockToken(user.id), user });
  }
  const { data } = await apiInstance.post<LoginResponse>(
    '/auth/register',
    payload,
  );
  return data;
};

// Тихое восстановление сессии по refresh-токену из httpOnly cookie.
// В моке cookie нет (её ставит только сервер) — поэтому всегда 401:
// сессия честно не переживает перезагрузку до появления бэкенда (ТЗ п.5).
export const refresh = async (): Promise<LoginResponse> => {
  if (USE_MOCKS) {
    throw new ApiError('Нет активной сессии', 401);
  }
  // Cookie уходит автоматически (withCredentials), тело не нужно.
  const { data } = await apiInstance.post<LoginResponse>('/auth/refresh');
  return data;
};

// Выход: на бэке инвалидирует refresh-cookie. В моке просто резолвится —
// очистку стора делает вызывающая сторона (фича auth).
export const logout = async (): Promise<void> => {
  if (USE_MOCKS) {
    await withDelay(undefined);
    return;
  }
  await apiInstance.post('/auth/logout');
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
