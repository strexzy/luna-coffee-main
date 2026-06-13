import axios, { isAxiosError } from 'axios';

import { API_URL, ROUTES } from '@shared/config';
import { useAuthStore } from '@shared/store';

import { toApiError } from './api-error';

// Единственный HTTP-клиент проекта. Прямые fetch/axios в компонентах
// запрещены соглашениями — все запросы идут через этот экземпляр.
export const apiInstance = axios.create({
  baseURL: API_URL,
  // withCredentials: refresh-токен в httpOnly cookie уходит автоматически,
  // когда появится бэкенд (ТЗ п.5). На моках безвредно.
  withCredentials: true,
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

    if (apiError.status === 401) {
      const url = isAxiosError(error) ? (error.config?.url ?? '') : '';
      // На auth-эндпоинтах (login/register/refresh) 401 ожидаем — это неверные
      // данные или отсутствие сессии. Отдаём ошибку вызывающей фиче, сессию
      // не трогаем и никуда не редиректим.
      const isAuthEndpoint = url.includes('/auth/');
      // Редирект нужен только когда протух токен активной сессии, а не когда
      // гость просто получил 401 на публичном запросе.
      const hadSession = useAuthStore.getState().token !== null;

      if (!isAuthEndpoint && hadSession) {
        // TODO(бэкенд): перед сбросом пробовать refresh по httpOnly cookie.
        useAuthStore.getState().clearSession();
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== ROUTES.login
        ) {
          window.location.assign(ROUTES.login);
        }
      }
    }

    return Promise.reject(apiError);
  },
);
