'use client';

import { useEffect, useState } from 'react';

import {
  getOrderStats,
  type OrderStats,
  type StatsRange,
} from '@entities/order';
import { ApiError } from '@shared/api';
import { MAX_STATS_RANGE_DAYS } from '@shared/config';

const toDateInput = (date: Date): string => date.toISOString().slice(0, 10);

// Сдвиг даты YYYY-MM-DD на N дней (UTC).
const shiftDays = (input: string, days: number): string => {
  const date = new Date(`${input}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateInput(date);
};

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
  // Границы для date-инпутов: размах периода ≤ MAX_STATS_RANGE_DAYS
  // (ревью [Фаза 8]) — не даём выбрать диапазон, который раздует график.
  bounds: { fromMin: string; toMax: string };
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
    bounds: {
      fromMin: shiftDays(range.to, -(MAX_STATS_RANGE_DAYS - 1)),
      toMax: shiftDays(range.from, MAX_STATS_RANGE_DAYS - 1),
    },
    stats,
    isLoading,
    error,
  };
};
