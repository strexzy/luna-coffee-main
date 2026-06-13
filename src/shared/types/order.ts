// Статусы заказа (ТЗ, п. 3.5): новый → принят → готовится → готов.
// Union-тип вместо enum — по соглашениям проекта.
export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready';

// Порядок прохождения статусов. Используется и мок-прогрессией реалтайма,
// и кнопкой бариста «дальше по статусу». Живёт в shared, т.к. нужен
// инфраструктуре shared/realtime (которая не может импортировать entities).
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'new',
  'accepted',
  'preparing',
  'ready',
];

// Следующий статус по цепочке либо null, если заказ уже готов.
export const getNextOrderStatus = (status: OrderStatus): OrderStatus | null => {
  const index = ORDER_STATUS_SEQUENCE.indexOf(status);
  if (index < 0 || index >= ORDER_STATUS_SEQUENCE.length - 1) {
    return null;
  }
  return ORDER_STATUS_SEQUENCE[index + 1];
};
