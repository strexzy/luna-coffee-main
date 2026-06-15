import { apiInstance, ApiError, withDelay } from '@shared/api';
import { USE_MOCKS } from '@shared/config';
import {
  publishNewOrder,
  publishOrderStatus,
  stopMockProgression,
} from '@shared/realtime';
import type { OrderStatus } from '@shared/types';

import type {
  CreateOrderPayload,
  DailySales,
  Order,
  OrderStats,
  PopularProduct,
  StatsRange,
} from '../model/types';
import { MOCK_ORDERS } from './order.mock';
import { generateOrderHistory } from './stats.mock';

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
    // Копия, чтобы потребитель не держал ссылку на мутируемый мок-объект.
    return withDelay({ ...order });
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
    const index = MOCK_ORDERS.findIndex((o) => o.id === orderId);
    if (index < 0) {
      throw new ApiError('Заказ не найден', 404);
    }
    // Заменяем элемент новым объектом, а не мутируем общий — иначе ссылку на
    // тот же объект могут держать другие части состояния (ревью #3).
    const updated: Order = { ...MOCK_ORDERS[index], status };
    MOCK_ORDERS[index] = updated;
    stopMockProgression(orderId);
    publishOrderStatus(orderId, status);
    return withDelay(updated);
  }
  const { data } = await apiInstance.patch<Order>(`/orders/${orderId}/status`, {
    status,
  });
  return data;
};

// Статистика заказов за период (админка, ТЗ 3.6). В моке агрегируется из
// детерминированной истории; на бэке — один запрос с теми же типами ответа.
export const getOrderStats = async (range: StatsRange): Promise<OrderStats> => {
  if (USE_MOCKS) {
    const history = generateOrderHistory(new Date());
    // Границы периода в UTC — согласованно с UTC-датами в истории.
    const fromTime = new Date(`${range.from}T00:00:00Z`).getTime();
    const toTime = new Date(`${range.to}T23:59:59Z`).getTime();
    const inRange = history.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= fromTime && t <= toTime;
    });

    const totalOrders = inRange.length;
    const totalRevenue = inRange.reduce((sum, o) => sum + o.total, 0);
    const avgCheck = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    // Популярные позиции — топ-5 по количеству.
    const byProduct = new Map<string, PopularProduct>();
    for (const order of inRange) {
      for (const item of order.items) {
        const current = byProduct.get(item.productId) ?? {
          productId: item.productId,
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
        current.quantity += item.quantity;
        current.revenue += item.revenue;
        byProduct.set(item.productId, current);
      }
    }
    const popularProducts = [...byProduct.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Продажи по дням — каждый день периода, включая нулевые.
    const dayMs = 86_400_000;
    const dailyMap = new Map<string, DailySales>();
    for (let t = fromTime; t <= toTime; t += dayMs) {
      const date = new Date(t).toISOString().slice(0, 10);
      dailyMap.set(date, { date, orders: 0, revenue: 0 });
    }
    for (const order of inRange) {
      const date = order.createdAt.slice(0, 10);
      const day = dailyMap.get(date);
      if (day) {
        day.orders += 1;
        day.revenue += order.total;
      }
    }
    const dailySales = [...dailyMap.values()];

    return withDelay({
      totalOrders,
      totalRevenue,
      avgCheck,
      popularProducts,
      dailySales,
    });
  }
  const { data } = await apiInstance.get<OrderStats>('/orders/stats', {
    params: range,
  });
  return data;
};
