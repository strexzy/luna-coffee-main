'use client';

import { OrderCard, ORDER_STATUS_LABELS, type Order } from '@entities/order';
import { getNextOrderStatus } from '@shared/types';
import { Button, EmptyState, Skeleton } from '@shared/ui';

import { useOrdersQueue } from '../model/use-orders-queue';

export const OrdersQueue = () => {
  const { orders, isLoading, error, advanceOrder, pendingId } =
    useOrdersQueue();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Очередь заказов</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={
            <Button variant="outline" onClick={() => location.reload()}>
              Обновить
            </Button>
          }
        />
      </div>
    );
  }

  const waiting = orders.filter(
    (o) => o.status === 'new' || o.status === 'accepted',
  ).length;
  const preparing = orders.filter((o) => o.status === 'preparing').length;
  const ready = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Очередь заказов</h1>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat label="Ожидают" value={waiting} />
        <Stat label="Готовятся" value={preparing} />
        <Stat label="Готовы" value={ready} />
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Заказов нет" description="Очередь пуста." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              action={
                <AdvanceAction
                  order={order}
                  pending={pendingId === order.id}
                  onAdvance={() => advanceOrder(order)}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border p-3 text-center">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

interface AdvanceProps {
  order: Order;
  pending: boolean;
  onAdvance: () => void;
}

// Кнопка перевода заказа на следующий статус. На «готов» — действий нет.
const AdvanceAction = ({ order, pending, onAdvance }: AdvanceProps) => {
  const next = getNextOrderStatus(order.status);
  if (!next) {
    return <span className="text-sm text-muted-foreground">Выдать</span>;
  }
  return (
    <Button size="sm" disabled={pending} onClick={onAdvance}>
      {pending ? '…' : `→ ${ORDER_STATUS_LABELS[next]}`}
    </Button>
  );
};
