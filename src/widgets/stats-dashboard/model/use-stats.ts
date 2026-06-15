'use client';

import { useEffect, useState } from 'react';

import {
  getOrderStats,
  type OrderStats,
  type StatsRange,
} from '@entities/order';
import { ApiError } from '@shared/api';

const toDateInput = (date: Date): string => date.toISOString().slice(0, 10);

// Период по умолчанию — последние 7 дней.
const defaultRange = (): StatsRange => {
  const to = new Date();
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - 6);
  return { from: toDateInput(from), to: toDateInput(to) };
};

interface UseStats {
  range: StatsRange;
  setFrom: (value: string) => void;
  setTo: (value: string) => void;
  stats: OrderStats | null;
  isLoading: boolean;
  error: string | null;
}

// Статистика админки за выбранный период. При смене периода — перезапрос;
// данные обновляются на месте (без мигания загрузкой после первого показа).
export const useStats = (): UseStats => {
  const [range, setRange] = useState<StatsRange>(defaultRange);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getOrderStats(range)
      .then((data) => {
        if (!active) return;
        setStats(data);
        setError(null);
      })
      .catch((e: unknown) => {
        if (active)
          setError(
            e instanceof ApiError
              ? e.message
              : 'Не удалось загрузить статистику',
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [range]);

  return {
    range,
    setFrom: (value) => setRange((r) => ({ ...r, from: value })),
    setTo: (value) => setRange((r) => ({ ...r, to: value })),
    stats,
    isLoading,
    error,
  };
};
