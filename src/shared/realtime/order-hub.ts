import { getNextOrderStatus, type OrderStatus } from '@shared/types';

// Мок-хаб реалтайма: in-memory pub/sub + «кухня» по таймеру + кросс-вкладочная
// доставка через BroadcastChannel. Два потока событий:
//   • смена статуса существующего заказа (status);
//   • приход нового заказа в очередь бариста (new).
// Реального WebSocket-сервера нет (ТЗ/mocks.md); интерфейс useOrderSocket и
// подписок от этого не зависит — переход на реальный сокет бесшовный.
//
// ВАЖНО (ограничение мока): BroadcastChannel работает ТОЛЬКО в пределах одного
// профиля браузера (вкладки одного окна). Инкогнито, другой браузер и другое
// устройство изолированы — между ними событие не пройдёт. Кросс-девайс реалтайм
// без общего состояния невозможен в принципе; он заработает лишь когда мок-хаб
// заменят на WS-клиент к Node-бэку. Проверять реалтайм нужно двумя ОБЫЧНЫМИ
// вкладками одного окна.

type StatusListener = (status: OrderStatus) => void;
// Новый заказ передаётся как unknown: тип Order живёт в entities, а shared не
// может его импортировать. Потребитель (очередь бариста) сужает тип у себя.
type NewOrderListener = (order: unknown) => void;

const statusListeners = new Map<string, Set<StatusListener>>();
const newOrderListeners = new Set<NewOrderListener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

// Интервал авто-прогрессии статуса (имитация работы кухни).
const PROGRESSION_STEP_MS = 5000;

const notifyStatus = (orderId: string, status: OrderStatus): void => {
  statusListeners.get(orderId)?.forEach((listener) => listener(status));
};

const notifyNewOrder = (order: unknown): void => {
  newOrderListeners.forEach((listener) => listener(order));
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
      notifyStatus(orderId, next);
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

// Сообщения кросс-вкладочной шины.
type ChannelMessage =
  | { kind: 'status'; orderId: string; status: OrderStatus }
  | { kind: 'new'; order: unknown };

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
    channel = new BroadcastChannel('luna-orders');
    channel.onmessage = (event: MessageEvent<ChannelMessage>) => {
      const message = event.data;
      if (message.kind === 'status') {
        // Внешнее обновление (бариста) отменяет авто-«кухню» в этой вкладке.
        stopMockProgression(message.orderId);
        notifyStatus(message.orderId, message.status);
      } else {
        notifyNewOrder(message.order);
      }
    };
  }
  return channel;
};

export const subscribeOrderStatus = (
  orderId: string,
  listener: StatusListener,
): (() => void) => {
  getChannel(); // гарантируем, что вкладка слушает кросс-вкладочные события
  const set = statusListeners.get(orderId) ?? new Set<StatusListener>();
  set.add(listener);
  statusListeners.set(orderId, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) statusListeners.delete(orderId);
  };
};

export const publishOrderStatus = (
  orderId: string,
  status: OrderStatus,
): void => {
  notifyStatus(orderId, status);
  getChannel()?.postMessage({ kind: 'status', orderId, status });
};

// Подписка очереди бариста на входящие заказы (ТЗ п. 3.5).
export const subscribeNewOrders = (
  listener: NewOrderListener,
): (() => void) => {
  getChannel();
  newOrderListeners.add(listener);
  return () => {
    newOrderListeners.delete(listener);
  };
};

export const publishNewOrder = (order: unknown): void => {
  notifyNewOrder(order);
  getChannel()?.postMessage({ kind: 'new', order });
};
