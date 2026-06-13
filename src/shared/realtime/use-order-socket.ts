'use client';

import { useEffect, useRef } from 'react';

import { USE_MOCKS, WS_URL } from '@shared/config';
import type { OrderStatus } from '@shared/types';

import { startMockProgression, subscribeOrderStatus } from './order-hub';

interface Options {
  // Стартовая точка мок-прогрессии. Если заказ уже ready — прогрессия не идёт.
  initialStatus?: OrderStatus;
  // Запускать мок-«кухню» (авто-прогрессию). На экране бариста не нужно —
  // там статус двигает сам сотрудник.
  autoProgress?: boolean;
}

// Подписка на обновления статуса заказа в реальном времени. Интерфейс хука
// одинаков для мока и реального WebSocket (ТЗ/mocks.md).
export const useOrderSocket = (
  orderId: string,
  onStatus: (status: OrderStatus) => void,
  options: Options = {},
): void => {
  const { initialStatus, autoProgress = false } = options;

  // callback-ref: эффект зависит только от orderId и не пересоздаёт соединение
  // при смене onStatus, при этом всегда вызывает свежий колбэк (паттерн против
  // stale-closure, рекомендованный для WebSocket-хуков).
  const onStatusRef = useRef(onStatus);
  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    const handle = (status: OrderStatus) => onStatusRef.current(status);

    if (USE_MOCKS) {
      const unsubscribe = subscribeOrderStatus(orderId, handle);
      if (autoProgress && initialStatus) {
        startMockProgression(orderId, initialStatus);
      }
      return unsubscribe;
    }

    // Реальный режим: нативный WebSocket. Заменяет мок без изменения интерфейса.
    const socket = new WebSocket(`${WS_URL}/orders/${orderId}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as { status: OrderStatus };
      handle(data.status);
    };
    return () => socket.close(1000, 'hook cleanup');
  }, [orderId, initialStatus, autoProgress]);
};
