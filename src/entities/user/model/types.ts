import type { AuthUser } from '@shared/types';

// Доменный пользователь = базовый AuthUser (нужен инфраструктуре shared)
// плюс профильные поля. Расширение вниз→вверх: entities дополняет shared.
export interface User extends AuthUser {
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Ответ авторизации: токен (в память, не в localStorage — ТЗ п.5) + пользователь.
export interface LoginResponse {
  token: string;
  user: User;
}
