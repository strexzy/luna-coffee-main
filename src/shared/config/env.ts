// Переменные окружения. Единственное место, где код читает process.env:
// так подмена значений при появлении бэка сведётся к правке .env, а не кода.

// Флаг мок-режима. По умолчанию true — бэкенда пока нет.
// Выключается только явным NEXT_PUBLIC_USE_MOCKS=false.
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

// Базовый URL будущего REST API (Node.js). Сейчас используется только
// заготовкой axios-экземпляра.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// Адрес будущего WebSocket-сервера (фаза 6).
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000';
