'use client';

import { useEffect, useState } from 'react';

import {
  getOrders,
  isOrder,
  registerIncomingOrder,
  type Order,
} from '@entities/order';
import { useUpdateOrderStatus } from '@features/update-order-status';
import { ApiError } from '@shared/api';
import { subscribeAllOrderStatus, subscribeNewOrders } from '@shared/realtime';
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
        if (!active) return;
        // Мёрж, а не замена: realtime-заказы, прилетевшие за время загрузки и
        // отсутствующие в серверном снимке, сохраняем (иначе теряются).
        setOrders((prev) => {
          const pending = prev.filter((p) => !list.some((l) => l.id === p.id));
          return [...pending, ...list];
        });
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

  // Входящие заказы в реальном времени (ТЗ 3.5): новый заказ клиента прилетает
  // по реалтайм-каналу (в т.ч. из другой вкладки) и добавляется в начало
  // очереди. registerIncomingOrder кладёт его в мок-список, чтобы бариста мог
  // менять статус.
  useEffect(() => {
    const unsubscribe = subscribeNewOrders((payload) => {
      // Payload из недоверенного реалтайм-канала — проверяем форму (ревью #4).
      if (!isOrder(payload)) return;
      registerIncomingOrder(payload);
      setOrders((prev) =>
        prev.some((o) => o.id === payload.id) ? prev : [payload, ...prev],
      );
    });
    return unsubscribe;
  }, []);

  // Смена статуса любого заказа (авто-«кухня» у клиента, другой бариста)
  // отражается в очереди — чтобы вид бариста не расходился с реальным статусом.
  useEffect(() => {
    const unsubscribe = subscribeAllOrderStatus((orderId, status) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
    });
    return unsubscribe;
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
