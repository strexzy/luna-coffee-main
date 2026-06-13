'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { ROUTES, USE_MOCKS } from '@shared/config';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@shared/ui';

import { loginSchema, type LoginValues } from '../model/auth.schema';
import { useLogin } from '../model/use-login';

export const LoginForm = () => {
  const { submit, isPending, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
        <CardDescription>Войдите в аккаунт «Луна Кофе»</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {/* Ошибка от сервера/мока (неверные данные) — над кнопкой. */}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Вход…' : 'Войти'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Нет аккаунта?{' '}
          <Link href={ROUTES.register} className="text-primary underline">
            Регистрация
          </Link>
        </p>

        {/* Подсказка с тестовыми аккаунтами — только в мок-режиме. */}
        {USE_MOCKS ? (
          <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium">
              Тестовые входы (пароль 12345678):
            </p>
            <p>client@luna.test — клиент</p>
            <p>barista@luna.test — бариста</p>
            <p>admin@luna.test — администратор</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
