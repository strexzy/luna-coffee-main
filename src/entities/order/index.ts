// Публичный API слайса entities/order.
export type { Order, OrderItem, CreateOrderPayload } from './model/types';
export { ORDER_STATUS_LABELS } from './model/types';
export {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  registerIncomingOrder,
} from './api/order.api';
export { OrderCard } from './ui/order-card';
export { OrderStatusBadge } from './ui/order-status-badge';
