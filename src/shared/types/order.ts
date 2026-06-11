// Статусы заказа (ТЗ, п. 3.5): новый → принят → готовится → готов.
// Union-тип вместо enum — по соглашениям проекта.
export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready';
