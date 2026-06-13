'use client';

import { useCallback, useState } from 'react';

import { useOrderSocket } from '@shared/realtime';
import { useActiveOrderStore } from '@shared/store';
import type { OrderStatus } from '@shared/types';

// Отслеживание статуса заказа у клиента в реальном времени. Подписывается на
// сокет (мок: хаб + авто-«кухня»), отдаёт актуальный статус и синхронизирует
// стор активного заказа, если отслеживаемый заказ — текущий.
export const useTrackOrder = (
  orderId: string,
  initialStatus: OrderStatus,
): OrderStatus => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const activeOrderId = useActiveOrderStore((s) => s.orderId);
  const updateActiveStatus = useActiveOrderStore((s) => s.updateStatus);

  const handleStatus = useCallback(
    (next: OrderStatus) => {
      setStatus(next);
      if (activeOrderId === orderId) {
        updateActiveStatus(next);
      }
    },
    [activeOrderId, orderId, updateActiveStatus],
  );

  useOrderSocket(orderId, handleStatus, { initialStatus, autoProgress: true });

  return status;
};
