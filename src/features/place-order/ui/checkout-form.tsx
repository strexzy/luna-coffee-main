'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { MIN_PREPARATION_MINUTES, ROUTES } from '@shared/config';
import { formatPrice } from '@shared/lib';
import { selectCartTotal, useCartStore } from '@shared/store';
import {
  Button,
  EmptyState,
  IconArrowLeft,
  Input,
  Label,
  Textarea,
} from '@shared/ui';

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { pickupTime: '', comment: '' },
  });

  // Дефолтное время получения проставляем на клиенте после монтирования:
  // Date.now() в рендере на пререндере дал бы время сборки и сломал гидрацию.
  // setValue — это RHF, не React-стейт, поэтому в эффекте безопасно.
  useEffect(() => {
    setValue(
      'pickupTime',
      toLocalInput(
        new Date(Date.now() + (MIN_PREPARATION_MINUTES + 5) * 60_000),
      ),
    );
  }, [setValue]);

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState
          title="Корзина пуста"
          description="Нечего оформлять — добавьте напиток из меню."
          action={
            <Button asChild className="rounded-full">
              <Link href={ROUTES.menu}>Перейти в меню</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-8">
      <Link
        href={ROUTES.cart}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="size-5" size={20} />
        Корзина
      </Link>
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight">Оформление</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-8">
        {/* Форма */}
        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          className="order-2 space-y-6 lg:order-1"
        >
          {/* Пункт самовывоза */}
          <div className="flex items-start gap-3 rounded-3xl bg-card p-5 ring-1 ring-border/50">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="font-semibold">Самовывоз</p>
              <p className="text-sm text-muted-foreground">
                Луна Кофе, ул. Свердлова, 56, Кировград
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl bg-card p-5 ring-1 ring-border/50">
            <div className="space-y-1.5">
              <Label htmlFor="pickupTime">Время получения</Label>
              <Input
                id="pickupTime"
                type="datetime-local"
                className="h-12 rounded-xl"
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
                className="rounded-xl"
                {...register('comment')}
              />
              {errors.comment ? (
                <p className="text-sm text-destructive">
                  {errors.comment.message}
                </p>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="submit"
            className="h-12 w-full rounded-full text-base"
            disabled={isPending}
          >
            {isPending ? 'Оформляем…' : `Оформить за ${formatPrice(total)}`}
          </Button>
        </form>

        {/* Сводка заказа */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-20">
          <div className="rounded-3xl bg-card p-5 ring-1 ring-border/50">
            <h2 className="font-bold">Состав заказа</h2>
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="font-medium">{item.name}</span>
                    {item.optionsLabel ? (
                      <span className="block truncate text-muted-foreground">
                        {item.optionsLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="whitespace-nowrap text-muted-foreground">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
              <span className="font-semibold">Итого</span>
              <span className="text-xl font-extrabold">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
