'use client';

import { useEffect, useState } from 'react';

import { getOrders, type Order } from '@entities/order';
import { useUpdateOrderStatus } from '@features/update-order-status';
import { ApiError } from '@shared/api';
import { getNextOrderStatus } from '@shared/types';

interface UseOrdersQueue {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  advanceOrder: (order: Order) => Promise<void>;
  pendingId: string | null;
}

// Очередь заказов бариста: загрузка списка + оптимистичная смена статуса.
export const useOrdersQueue = (): UseOrdersQueue => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { advance, pendingId } = useUpdateOrderStatus();

  useEffect(() => {
    let active = true;
    getOrders()
      .then((list) => {
        if (active) setOrders(list);
      })
      .catch((e: unknown) => {
        if (active)
          setError(
            e instanceof ApiError ? e.message : 'Не удалось загрузить очередь',
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const advanceOrder = async (order: Order): Promise<void> => {
    const next = getNextOrderStatus(order.status);
    if (!next) return;
    // Оптимистично двигаем статус в списке…
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)),
    );
    const result = await advance(order);
    if (!result) {
      // …и откатываем, если запрос не прошёл.
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: order.status } : o,
        ),
      );
    }
  };

  return { orders, isLoading, error, advanceOrder, pendingId };
};
