import { z } from 'zod';

import { MIN_PREPARATION_MINUTES } from '@shared/config';

// Время получения — не ранее чем через MIN_PREPARATION_MINUTES от текущего
// момента (ТЗ п. 3.2). Значение приходит из input[type=datetime-local]
// в локальном времени без таймзоны.
export const checkoutSchema = z.object({
  pickupTime: z
    .string()
    .min(1, 'Выберите время получения')
    .refine((value) => {
      const time = new Date(value).getTime();
      return (
        !Number.isNaN(time) &&
        time >= Date.now() + MIN_PREPARATION_MINUTES * 60_000
      );
    }, `Получение не ранее чем через ${MIN_PREPARATION_MINUTES} минут`),
  comment: z.string().max(300, 'Не более 300 символов').optional(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
