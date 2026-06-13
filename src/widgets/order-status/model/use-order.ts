'use client';

import { useEffect, useState } from 'react';

import { getOrderById, type Order } from '@entities/order';
import { ApiError } from '@shared/api';

type OrderFetchStatus = 'loading' | 'error' | 'not-found' | 'ready';

interface UseOrder {
  order: Order | null;
  status: OrderFetchStatus;
  errorMessage: string | null;
}

// Клиентская загрузка заказа: только что оформленный заказ живёт в мок-памяти
// клиента, поэтому фетчим на клиенте (серверный инстанс моков его не видит).
export const useOrder = (id: string): UseOrder => {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderFetchStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getOrderById(id)
      .then((o) => {
        if (!active) return;
        setOrder(o);
        setStatus('ready');
      })
      .catch((e: unknown) => {
        if (!active) return;
        if (e instanceof ApiError && e.status === 404) {
          setStatus('not-found');
          return;
        }
        setErrorMessage(e instanceof ApiError ? e.message : 'Ошибка загрузки');
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { order, status, errorMessage };
};
