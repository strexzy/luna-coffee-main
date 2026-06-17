import { z } from 'zod';

// Схема редактирования профиля (ТЗ §3.4). Телефон необязателен; пустую строку
// из инпута считаем «не указан» (превратим в undefined при отправке).
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Не короче 2 символов')
    .max(60, 'Не более 60 символов'),
  phone: z.string().max(20, 'Не более 20 символов').optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
