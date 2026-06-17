import type { AuthUser, UserRole } from '@shared/types';

// Доменный пользователь = базовый AuthUser (нужен инфраструктуре shared)
// плюс профильные поля. Расширение вниз→вверх: entities дополняет shared.
export interface User extends AuthUser {
  phone?: string;
}

// Полезная нагрузка редактирования профиля (ТЗ §3.4). Email и роль в моке
// не редактируются — меняем то, что пользователь вправе сам поменять.
export interface UpdateProfilePayload {
  name: string;
  phone?: string;
}

// Русские подписи ролей — для экрана профиля/аккаунта.
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  client: 'Клиент',
  staff: 'Бариста',
  admin: 'Администратор',
};

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Ответ авторизации: токен (в память, не в localStorage — ТЗ п.5) + пользователь.
export interface LoginResponse {
  token: string;
  user: User;
}
