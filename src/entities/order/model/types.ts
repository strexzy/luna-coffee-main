import type { CartItem, OrderStatus } from '@shared/types';

// Позиция заказа — снимок строки корзины на момент оформления.
// Берём подмножество CartItem (shared), чтобы не дублировать контракт между
// слоями; в заказе не нужен ключ мерджа корзины (id строки).
export type OrderItem = Pick<
  CartItem,
  'productId' | 'name' | 'imageUrl' | 'unitPrice' | 'quantity' | 'optionsLabel'
>;

export interface Order {
  id: string;
  // Человекочитаемый номер для клиента и бариста (№ 3435).
  number: number;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  // Время получения (ISO). Валидация ≥ now+10мин — на оформлении (Фаза 5).
  pickupTime: string;
  createdAt: string;
  comment?: string;
}

// Полезная нагрузка создания заказа. Номер, статус и даты проставляет
// бэкенд (сейчас — мок), поэтому их здесь нет.
export interface CreateOrderPayload {
  items: OrderItem[];
  pickupTime: string;
  comment?: string;
}

// Русские подписи статусов. Цвета бейджа — в ui/order-status-badge.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  accepted: 'Принят',
  preparing: 'Готовится',
  ready: 'Готов',
};
