import { z } from 'zod';

// Схемы валидации форм авторизации. Тип формы выводится из схемы (z.infer) —
// не дублируем (соглашения проекта).

export const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Введите имя'),
    email: z.string().min(1, 'Введите email').email('Некорректный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
