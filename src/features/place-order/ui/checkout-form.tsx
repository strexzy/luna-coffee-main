'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { MIN_PREPARATION_MINUTES, ROUTES } from '@shared/config';
import { formatPrice } from '@shared/lib';
import { selectCartTotal, useCartStore } from '@shared/store';
import { Button, EmptyState, Input, Label, Textarea } from '@shared/ui';

import { checkoutSchema, type CheckoutValues } from '../model/checkout.schema';
import { usePlaceOrder } from '../model/use-place-order';

// Дата в формат input[type=datetime-local] (локальное время, без таймзоны).
const toLocalInput = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const CheckoutForm = () => {
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const { submit, isPending, error } = usePlaceOrder();

  // Границы времени получения считаем один раз в инициализаторе useState:
  // Date.now() прямо в теле рендера нарушил бы чистоту (react-hooks/purity).
  const [pickupBounds] = useState(() => ({
    min: toLocalInput(new Date(Date.now() + MIN_PREPARATION_MINUTES * 60_000)),
    default: toLocalInput(
      new Date(Date.now() + (MIN_PREPARATION_MINUTES + 5) * 60_000),
    ),
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { pickupTime: pickupBounds.default, comment: '' },
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState
          title="Корзина пуста"
          description="Нечего оформлять — добавьте напиток из меню."
          action={
            <Button asChild>
              <Link href={ROUTES.menu}>Перейти в меню</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Оформление</h1>

      {/* Состав заказа */}
      <section className="mb-6">
        <h2 className="mb-2 font-semibold">Состав заказа</h2>
        <div className="divide-y rounded-lg border">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                {item.optionsLabel ? (
                  <p className="truncate text-sm text-muted-foreground">
                    {item.optionsLabel}
                  </p>
                ) : null}
              </div>
              <span className="whitespace-nowrap text-sm">
                {item.quantity} × {formatPrice(item.unitPrice)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 font-bold">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="pickupTime">Время получения</Label>
          <Input
            id="pickupTime"
            type="datetime-local"
            min={pickupBounds.min}
            {...register('pickupTime')}
          />
          <p className="text-xs text-muted-foreground">
            Не ранее чем через {MIN_PREPARATION_MINUTES} минут.
          </p>
          {errors.pickupTime ? (
            <p className="text-sm text-destructive">
              {errors.pickupTime.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="comment">Комментарий к заказу</Label>
          <Textarea
            id="comment"
            placeholder="Например: без сахара"
            {...register('comment')}
          />
          {errors.comment ? (
            <p className="text-sm text-destructive">{errors.comment.message}</p>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="submit"
          className="h-12 w-full text-base"
          disabled={isPending}
        >
          {isPending ? 'Оформляем…' : `Оформить за ${formatPrice(total)}`}
        </Button>
      </form>
    </div>
  );
};
