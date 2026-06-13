import type { ReactNode } from 'react';

import { formatPrice, formatDate } from '@shared/lib';
import { Card } from '@shared/ui';

import type { Order } from '../model/types';
import { OrderStatusBadge } from './order-status-badge';

interface Props {
  order: Order;
  // Слот действия (сменить статус у бариста, повторить заказ у клиента).
  // Внедряется фичей на уровне виджета/страницы (Фазы 5–7).
  action?: ReactNode;
}

// Компактная карточка заказа для списков: очередь бариста, история клиента.
export const OrderCard = ({ order, action }: Props) => {
  const itemsSummary = order.items
    .map((i) => (i.quantity > 1 ? `${i.name} ×${i.quantity}` : i.name))
    .join(', ');

  return (
    <Card className="gap-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold">№ {order.number}</p>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="truncate text-sm text-muted-foreground">{itemsSummary}</p>

      <div className="flex items-center justify-between">
        <span className="font-bold">{formatPrice(order.totalPrice)}</span>
        {action}
      </div>
    </Card>
  );
};
