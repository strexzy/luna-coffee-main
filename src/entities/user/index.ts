// Публичный API слайса entities/user.
export type { User, LoginPayload, LoginResponse } from './model/types';
export { login, getProfile } from './api/user.api';
