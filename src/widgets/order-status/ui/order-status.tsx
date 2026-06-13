'use client';

import Image from 'next/image';
import Link from 'next/link';

import { OrderStatusBadge, type Order } from '@entities/order';
import { useTrackOrder } from '@features/track-order';
import { ROUTES } from '@shared/config';
import { formatDate, formatPrice, formatTime } from '@shared/lib';
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
            <Button asChild variant="outline">
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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Номер заказа</p>
          <p className="text-3xl font-bold text-primary">№ {order.number}</p>
        </div>
        <OrderStatusBadge status={liveStatus} className="h-7 px-3 text-sm" />
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        {isReady
          ? 'Заказ готов — можно забирать.'
          : 'Статус обновляется автоматически.'}
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Оформлен</p>
          <p>{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Время получения</p>
          <p>{formatTime(order.pickupTime)}</p>
        </div>
      </div>

      <h2 className="mb-2 font-semibold">Состав заказа</h2>
      <div className="divide-y rounded-lg border">
        {order.items.map((item) => (
          <div
            key={`${item.productId}-${item.optionsLabel ?? ''}`}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
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
        <div className="flex items-center justify-between px-4 py-3 font-bold">
          <span>Итого</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>
      </div>

      {order.comment ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Комментарий: {order.comment}
        </p>
      ) : null}

      <Button asChild variant="outline" className="mt-6 w-full">
        <Link href={ROUTES.menu}>Вернуться в меню</Link>
      </Button>
    </div>
  );
};
