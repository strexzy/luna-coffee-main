'use client';

import { useState } from 'react';

import { updateOrderStatus, type Order } from '@entities/order';
import { ApiError } from '@shared/api';
import { getNextOrderStatus, type OrderStatus } from '@shared/types';
import { toast } from '@shared/ui';

interface UseUpdateOrderStatus {
  // Двигает заказ на следующий статус. Возвращает новый статус или null
  // (если заказ уже готов либо запрос упал).
  advance: (order: Order) => Promise<OrderStatus | null>;
  pendingId: string | null;
}

// Действие бариста: смена статуса заказа. Сам сетевой вызов + тосты ошибок;
// оптимистичное обновление списка делает виджет очереди.
export const useUpdateOrderStatus = (): UseUpdateOrderStatus => {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const advance = async (order: Order): Promise<OrderStatus | null> => {
    const next = getNextOrderStatus(order.status);
    if (!next) return null;
    setPendingId(order.id);
    try {
      await updateOrderStatus(order.id, next);
      return next;
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : 'Не удалось сменить статус',
      );
      return null;
    } finally {
      setPendingId(null);
    }
  };

  return { advance, pendingId };
};
