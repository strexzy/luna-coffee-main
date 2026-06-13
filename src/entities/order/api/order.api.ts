import { apiInstance, ApiError, withDelay } from '@shared/api';
import { USE_MOCKS } from '@shared/config';

import type { CreateOrderPayload, Order } from '../model/types';
import { MOCK_ORDERS } from './order.mock';

// API заказов. Создание и чтение через одни и те же функции для мока и бэка.

export const getOrders = async (): Promise<Order[]> => {
  if (USE_MOCKS) {
    return withDelay(MOCK_ORDERS);
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
    return withDelay(order);
  }
  const { data } = await apiInstance.post<Order>('/orders', payload);
  return data;
};
