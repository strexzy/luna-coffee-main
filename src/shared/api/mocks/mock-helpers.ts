import { MOCK_DELAY_MS } from '@shared/config';

import { ApiError } from '../api-error';

// Домено-независимая инфраструктура мок-режима. Мок-данные сущностей живут
// в entities/*/api (см. .claude/rules/mocks.md) и используют эти хелперы.

const randomDelay = (): number =>
  MOCK_DELAY_MS.min + Math.random() * (MOCK_DELAY_MS.max - MOCK_DELAY_MS.min);

// Имитация сетевой задержки: мок-функции возвращают данные не мгновенно,
// чтобы состояния загрузки были видны и тестируемы.
export const withDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), randomDelay());
  });

// Имитация сетевой ошибки с заданной вероятностью. По умолчанию 0 —
// ошибки включаются точечно там, где проверяется их обработка.
export const maybeFail = (
  probability = 0,
  message = 'Сетевая ошибка (имитация мок-режима)',
): void => {
  if (Math.random() < probability) {
    throw new ApiError(message);
  }
};
