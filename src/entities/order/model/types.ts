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

// --- Статистика для админки (Фаза 7) ---

// Период выборки статистики (границы — даты YYYY-MM-DD).
export interface StatsRange {
  from: string;
  to: string;
}

export interface PopularProduct {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DailySales {
  date: string; // YYYY-MM-DD
  orders: number;
  revenue: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  avgCheck: number;
  popularProducts: PopularProduct[];
  dailySales: DailySales[];
}

// Русские подписи статусов. Цвета бейджа — в ui/order-status-badge.
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  accepted: 'Принят',
  preparing: 'Готовится',
  ready: 'Готов',
};

// Проверка формы позиции заказа. Без неё payload с `items: [мусор]` проходил
// guard и ронял OrderCard при рендере (ревью [Фаза 8]) — проверяем ключевые
// поля, которые читают потребители (name/quantity в карточке, productId как
// ключ, unitPrice в подсчётах).
const isOrderItem = (value: unknown): value is OrderItem => {
  if (typeof value !== 'object' || value === null) return false;
  const i = value as Record<string, unknown>;
  return (
    typeof i.productId === 'string' &&
    typeof i.name === 'string' &&
    typeof i.unitPrice === 'number' &&
    typeof i.quantity === 'number'
  );
};

// Проверка формы заказа. Нужна для данных из недоверенного источника —
// реалтайм-канала между вкладками (ревью #4): чужой/битый payload отсекаем.
export const isOrder = (value: unknown): value is Order => {
  if (typeof value !== 'object' || value === null) return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.number === 'number' &&
    Array.isArray(o.items) &&
    o.items.every(isOrderItem) &&
    typeof o.totalPrice === 'number' &&
    typeof o.status === 'string'
  );
};
