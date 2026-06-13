import { apiInstance, ApiError, withDelay } from '@shared/api';
import { USE_MOCKS } from '@shared/config';
import {
  publishNewOrder,
  publishOrderStatus,
  stopMockProgression,
} from '@shared/realtime';
import type { OrderStatus } from '@shared/types';

import type { CreateOrderPayload, Order } from '../model/types';
import { MOCK_ORDERS } from './order.mock';

// API заказов. Создание и чтение через одни и те же функции для мока и бэка.

export const getOrders = async (): Promise<Order[]> => {
  if (USE_MOCKS) {
    // Копия, а не сам MOCK_ORDERS: иначе состояние очереди разделяет ссылку с
    // мок-массивом, и его мутации (registerIncomingOrder/createOrder) не дают
    // React увидеть изменение — заказ «есть» в массиве, но UI не ререндерится.
    return withDelay([...MOCK_ORDERS]);
  }
  const { data } = await apiInstance.get<Order[]>('/orders');
  return data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  if (USE_MOCKS) {
    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (!order) {
      throw new ApiError('Заказ не найден', 404);
    }
    return withDelay(order);
  }
  const { data } = await apiInstance.get<Order>(`/orders/${id}`);
  return data;
};

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  if (USE_MOCKS) {
    // Номер, статус и даты в реальности проставляет сервер — имитируем.
    const now = new Date();
    const order: Order = {
      id: `order-${Date.now()}`,
      number: Math.floor(3000 + Math.random() * 7000),
      items: payload.items,
      totalPrice: payload.items.reduce(
        (sum, i) => sum + i.unitPrice * i.quantity,
        0,
      ),
      status: 'new',
      pickupTime: payload.pickupTime,
      createdAt: now.toISOString(),
      comment: payload.comment,
    };
    // Кладём в мок-список, чтобы экран статуса нашёл заказ через getOrderById.
    // Живёт до перезагрузки (без бэка персистентности нет) — допустимо.
    MOCK_ORDERS.unshift(order);
    // Транслируем заказ в очередь бариста (в т.ч. в другую вкладку) — ТЗ 3.5
    // «входящие заказы в реальном времени».
    publishNewOrder(order);
    return withDelay(order);
  }
  const { data } = await apiInstance.post<Order>('/orders', payload);
  return data;
};

// Регистрирует заказ, пришедший из другой вкладки по реалтайм-каналу, в
// мок-списке этой вкладки. Нужно, чтобы бариста мог менять ему статус
// (updateOrderStatus ищет заказ в MOCK_ORDERS). В реальном режиме не нужен —
// заказы приходят с сервера.
export const registerIncomingOrder = (order: Order): void => {
  if (!USE_MOCKS) return;
  if (!MOCK_ORDERS.some((o) => o.id === order.id)) {
    MOCK_ORDERS.unshift(order);
  }
};

// Смена статуса заказа (действие бариста). В моке: правим заказ, гасим
// авто-прогрессию (управление перешло к сотруднику) и публикуем статус в хаб,
// чтобы подписанные клиенты увидели обновление в реальном времени.
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
): Promise<Order> => {
  if (USE_MOCKS) {
    const order = MOCK_ORDERS.find((o) => o.id === orderId);
    if (!order) {
      throw new ApiError('Заказ не найден', 404);
    }
    order.status = status;
    stopMockProgression(orderId);
    publishOrderStatus(orderId, status);
    return withDelay(order);
  }
  const { data } = await apiInstance.patch<Order>(`/orders/${orderId}/status`, {
    status,
  });
  return data;
};
