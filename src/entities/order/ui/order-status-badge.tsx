import type { OrderStatus } from '@shared/types';
import { Badge } from '@shared/ui';
import { cn } from '@shared/lib';

import { ORDER_STATUS_LABELS } from '../model/types';

interface Props {
  status: OrderStatus;
  className?: string;
}

// Цвета статусов: ожидание — янтарный, в работе — синий, готов — зелёный.
// Tailwind-токены (не hex) — допускается соглашениями для статусной палитры,
// которой нет в теме Shadcn.
const STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'bg-amber-100 text-amber-700',
  accepted: 'bg-sky-100 text-sky-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-green-100 text-green-700',
};

export const OrderStatusBadge = ({ status, className }: Props) => {
  return (
    <Badge className={cn(STATUS_STYLES[status], className)}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
};
