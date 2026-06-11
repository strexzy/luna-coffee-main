import axios from 'axios';

import { API_URL } from '@shared/config';
import { useAuthStore } from '@shared/store';

import { toApiError } from './api-error';

// Единственный HTTP-клиент проекта. Прямые fetch/axios в компонентах
// запрещены соглашениями — все запросы идут через этот экземпляр.
export const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

// Токен подставляется из стора в памяти (не из localStorage — ТЗ, п. 5).
apiInstance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    // 401 — сессия недействительна: сбрасываем её централизованно.
    // TODO: редирект на /login появится в фазе 4 (авторизация).
    if (apiError.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(apiError);
  },
);
