'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

import {
  ORDER_STATUS_LABELS,
  OrderStatusBadge,
  type Order,
} from '@entities/order';
import { useTrackOrder } from '@features/track-order';
import { ROUTES } from '@shared/config';
import { cn, formatDate, formatPrice, formatTime } from '@shared/lib';
import { ORDER_STATUS_SEQUENCE } from '@shared/types';
import { Button, EmptyState, Spinner } from '@shared/ui';

import { useOrder } from '../model/use-order';

interface Props {
  orderId: string;
}

// Экран статуса заказа. Загружает заказ, затем показывает статус в реальном
// времени (мок-сокет с авто-прогрессией; смена статуса бариста тоже прилетает).
export const OrderStatus = ({ orderId }: Props) => {
  const { order, status, errorMessage } = useOrder(orderId);

  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (status === 'not-found' || status === 'error') {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        <EmptyState
          title={status === 'not-found' ? 'Заказ не найден' : 'Ошибка загрузки'}
          description={
            status === 'not-found'
              ? 'Возможно, ссылка устарела или заказ ещё не оформлен.'
              : (errorMessage ?? 'Попробуйте позже.')
          }
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href={ROUTES.menu}>Вернуться в меню</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return <OrderReceipt order={order} />;
};

// Чек заказа с живым статусом. Вынесен отдельно, чтобы хук useTrackOrder
// вызывался безусловно (только когда заказ уже загружен).
const OrderReceipt = ({ order }: { order: Order }) => {
  const liveStatus = useTrackOrder(order.id, order.status);
  const isReady = liveStatus === 'ready';
  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(liveStatus);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pt-4 pb-8">
      {/* Шапка со статусом */}
      <div className="rounded-3xl bg-card p-6 ring-1 ring-border/50">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Номер заказа</p>
            <p className="text-4xl font-extrabold text-primary">
              № {order.number}
            </p>
          </div>
          <OrderStatusBadge status={liveStatus} className="h-7 px-3 text-sm" />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {isReady
            ? 'Заказ готов — можно забирать 🎉'
            : 'Статус обновляется автоматически.'}
        </p>

        {/* Таймлайн прогресса */}
        <ol className="mt-6 flex items-start">
          {ORDER_STATUS_SEQUENCE.map((s, i) => {
            const done = i <= currentIndex;
            return (
              <li key={s} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <Segment visible={i > 0} done={i <= currentIndex} />
                  <div
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                      done
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {i < currentIndex ? (
                      <Check className="size-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <Segment
                    visible={i < ORDER_STATUS_SEQUENCE.length - 1}
                    done={i < currentIndex}
                  />
                </div>
                <span
                  className={cn(
                    'mt-2 text-center text-xs',
                    done
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {ORDER_STATUS_LABELS[s]}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Детали */}
      <div className="mt-4 grid grid-cols-2 gap-3 rounded-3xl bg-card p-5 text-sm ring-1 ring-border/50">
        <div>
          <p className="text-muted-foreground">Оформлен</p>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Время получения</p>
          <p className="font-medium">{formatTime(order.pickupTime)}</p>
        </div>
      </div>

      {/* Состав */}
      <div className="mt-4 rounded-3xl bg-card p-5 ring-1 ring-border/50">
        <h2 className="font-bold">Состав заказа</h2>
        <div className="mt-3 divide-y divide-border/60">
          {order.items.map((item) => (
            <div
              key={`${item.productId}-${item.optionsLabel ?? ''}`}
              className="flex items-center gap-3 py-3"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
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
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-3 font-bold">
          <span>Итого</span>
          <span className="text-lg">{formatPrice(order.totalPrice)}</span>
        </div>
        {order.comment ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Комментарий: {order.comment}
          </p>
        ) : null}
      </div>

      <Button
        asChild
        variant="outline"
        className="mt-6 w-full rounded-full"
      >
        <Link href={ROUTES.menu}>Вернуться в меню</Link>
      </Button>
    </div>
  );
};

// Сегмент соединительной линии таймлайна между кружками.
const Segment = ({ visible, done }: { visible: boolean; done: boolean }) => (
  <div
    className={cn(
      'h-1 flex-1 rounded-full',
      !visible ? 'opacity-0' : done ? 'bg-primary' : 'bg-muted',
    )}
  />
);
