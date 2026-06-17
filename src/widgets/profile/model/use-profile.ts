'use client';

import { useEffect, useState } from 'react';

import { getMyOrders, type Order } from '@entities/order';
import { getProfile, type User } from '@entities/user';
import { ApiError } from '@shared/api';

interface UseProfile {
  user: User | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  // Отдельно от error: 401 — это не сбой, а «не вошёл» → показываем приглашение.
  unauthorized: boolean;
  // Локальное обновление после редактирования (без перезапроса профиля).
  setUser: (user: User) => void;
}

// Данные личного кабинета: профиль и (опц.) история заказов. История нужна
// только клиенту — у бариста/админа её не запрашиваем.
export const useProfile = (withOrders: boolean): UseProfile => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const profile = await getProfile();
        if (!active) return;
        setUser(profile);
        if (withOrders) {
          const list = await getMyOrders();
          if (active) setOrders(list);
        }
      } catch (e) {
        if (!active) return;
        if (e instanceof ApiError && e.status === 401) {
          setUnauthorized(true);
        } else {
          setError(
            e instanceof ApiError ? e.message : 'Не удалось загрузить профиль',
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [withOrders]);

  return { user, orders, isLoading, error, unauthorized, setUser };
};
