import { isAxiosError } from 'axios';

// Нормализованная ошибка API. Компоненты и хуки работают только с ней,
// не разбирая сырые AxiosError — централизованная обработка по ТЗ (п. 5).
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Приводит любую ошибку (axios, мок, неожиданную) к ApiError.
export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  if (isAxiosError(error)) {
    // Ошибка без ответа — сеть недоступна или таймаут.
    if (!error.response) {
      return new ApiError('Нет соединения с сервером. Проверьте сеть.');
    }
    return new ApiError(
      // Бэкенд будет присылать message в теле ошибки — контракт зафиксирован.
      (error.response.data as { message?: string })?.message ??
        'Ошибка сервера. Попробуйте ещё раз.',
      error.response.status,
    );
  }
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  return new ApiError('Неизвестная ошибка.');
};
