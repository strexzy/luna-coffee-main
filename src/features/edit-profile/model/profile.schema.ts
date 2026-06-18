import { z } from 'zod';

// Схема редактирования профиля (ТЗ §3.4). Телефон необязателен; если указан —
// ровно 11 цифр (формат РФ). Пустую строку из инпута считаем «не указан»
// (превратим в undefined при отправке).
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Не короче 2 символов')
    .max(60, 'Не более 60 символов'),
  phone: z
    .string()
    .regex(/^\d{11}$/, 'Номер телефона — ровно 11 цифр, например 79001234567')
    .or(z.literal('')),
});

export type ProfileValues = z.infer<typeof profileSchema>;
