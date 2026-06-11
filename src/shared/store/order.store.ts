import { create } from 'zustand';

import type { OrderStatus } from '@shared/types';

// Заготовка стора активного заказа клиента. Реал-тайм обновление статуса
// через useOrderSocket подключится в фазе 6.

interface ActiveOrderState {
  orderId: string | null;
  status: OrderStatus | null;
  setActiveOrder: (orderId: string, status: OrderStatus) => void;
  updateStatus: (status: OrderStatus) => void;
  clear: () => void;
}

export const useActiveOrderStore = create<ActiveOrderState>((set) => ({
  orderId: null,
  status: null,
  setActiveOrder: (orderId, status) => set({ orderId, status }),
  updateStatus: (status) => set({ status }),
  clear: () => set({ orderId: null, status: null }),
}));
