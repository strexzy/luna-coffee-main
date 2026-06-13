// Публичный API сегмента shared/types.
export type { UserRole, AuthUser } from './user';
export type { OrderStatus } from './order';
export { ORDER_STATUS_SEQUENCE, getNextOrderStatus } from './order';
export type { CartItem } from './cart';
