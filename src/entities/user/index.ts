// Публичный API слайса entities/user.
export type {
  User,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
} from './model/types';
export { login, register, refresh, logout, getProfile } from './api/user.api';
