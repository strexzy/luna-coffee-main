// Публичный API слайса entities/order.
export type {
  Order,
  OrderItem,
  CreateOrderPayload,
  OrderStats,
  StatsRange,
  PopularProduct,
  DailySales,
} from './model/types';
export { ORDER_STATUS_LABELS, isOrder } from './model/types';
export {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  registerIncomingOrder,
  getOrderStats,
} from './api/order.api';
export { OrderCard } from './ui/order-card';
export { OrderStatusBadge } from './ui/order-status-badge';
