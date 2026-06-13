// Публичный API сегмента shared/realtime.
export { useOrderSocket } from './use-order-socket';
export {
  subscribeOrderStatus,
  subscribeAllOrderStatus,
  publishOrderStatus,
  subscribeNewOrders,
  publishNewOrder,
  startMockProgression,
  stopMockProgression,
} from './order-hub';
