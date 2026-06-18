'use client';

import { useEffect, useState } from 'react';

import { cn } from '@shared/lib';

// Часы по дням недели getDay(): 0=Вс … 6=Сб. [открытие, закрытие] в минутах
// от полуночи. Будни 08:00–20:00, выходные 10:00–20:00.
const SCHEDULE: [number, number][] = [
  [600, 1200], // Вс
  [480, 1200], // Пн
  [480, 1200], // Вт
  [480, 1200], // Ср
  [480, 1200], // Чт
  [480, 1200], // Пт
  [600, 1200], // Сб
];

// Живой бейдж «Открыто/Закрыто». Время берём на клиенте после монтирования —
// иначе server/client разойдутся в гидрации (разное время рендера).
export const OpenStatus = () => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Время ставим только из таймеров (не синхронно в эффекте): начальное —
    // через 0мс после монтирования, дальше раз в минуту.
    const update = () => setNow(new Date());
    const initial = setTimeout(update, 0);
    const interval = setInterval(update, 60_000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  if (!now) return null;

  const [open, close] = SCHEDULE[now.getDay()];
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isOpen = minutes >= open && minutes < close;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          isOpen ? 'bg-primary' : 'bg-muted-foreground',
        )}
      />
      {isOpen ? 'Открыто' : 'Закрыто'}
    </span>
  );
};
