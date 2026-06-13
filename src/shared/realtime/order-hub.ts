import { getNextOrderStatus, type OrderStatus } from '@shared/types';

// Мок-хаб реалтайма: in-memory pub/sub статусов заказов + «кухня» по таймеру +
// кросс-вкладочная доставка через BroadcastChannel. Реального WebSocket-сервера
// нет (ТЗ/mocks.md), события эмулируются здесь; интерфейс useOrderSocket от
// этого не зависит — переход на реальный сокет бесшовный.

type StatusListener = (status: OrderStatus) => void;

const listeners = new Map<string, Set<StatusListener>>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

// Интервал авто-прогрессии статуса (имитация работы кухни).
const PROGRESSION_STEP_MS = 5000;

const notifyLocal = (orderId: string, status: OrderStatus): void => {
  listeners.get(orderId)?.forEach((listener) => listener(status));
};

// Таймерная прогрессия статуса new→…→ready. Запускается один раз на заказ.
export const startMockProgression = (
  orderId: string,
  current: OrderStatus,
): void => {
  if (timers.has(orderId)) return;
  const scheduleNext = (status: OrderStatus) => {
    const next = getNextOrderStatus(status);
    if (!next) {
      timers.delete(orderId);
      return;
    }
    const timer = setTimeout(() => {
      notifyLocal(orderId, next);
      scheduleNext(next);
    }, PROGRESSION_STEP_MS);
    timers.set(orderId, timer);
  };
  scheduleNext(current);
};

// Останавливает авто-прогрессию (управление статусом перешло к бариста).
export const stopMockProgression = (orderId: string): void => {
  const timer = timers.get(orderId);
  if (timer) {
    clearTimeout(timer);
    timers.delete(orderId);
  }
};

// Кросс-вкладочная шина (мок): бариста в одной вкладке, клиент — в другой.
// BroadcastChannel доступен только в браузере, поэтому создаём лениво.
let channel: BroadcastChannel | null = null;
const getChannel = (): BroadcastChannel | null => {
  if (
    typeof window === 'undefined' ||
    typeof BroadcastChannel === 'undefined'
  ) {
    return null;
  }
  if (!channel) {
    channel = new BroadcastChannel('luna-order-status');
    channel.onmessage = (
      event: MessageEvent<{ orderId: string; status: OrderStatus }>,
    ) => {
      const { orderId, status } = event.data;
      // Внешнее обновление (бариста) отменяет авто-«кухню» в этой вкладке,
      // чтобы таймер и ручное управление не конфликтовали.
      stopMockProgression(orderId);
      notifyLocal(orderId, status);
    };
  }
  return channel;
};

export const subscribeOrderStatus = (
  orderId: string,
  listener: StatusListener,
): (() => void) => {
  // Гарантируем, что вкладка слушает кросс-вкладочные события.
  getChannel();
  const set = listeners.get(orderId) ?? new Set<StatusListener>();
  set.add(listener);
  listeners.set(orderId, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) listeners.delete(orderId);
  };
};

// Публикует статус локальным подписчикам и в другие вкладки.
export const publishOrderStatus = (
  orderId: string,
  status: OrderStatus,
): void => {
  notifyLocal(orderId, status);
  getChannel()?.postMessage({ orderId, status });
};
