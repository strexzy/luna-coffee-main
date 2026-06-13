// Публичный API сегмента shared/realtime.
export { useOrderSocket } from './use-order-socket';
export {
  subscribeOrderStatus,
  publishOrderStatus,
  subscribeNewOrders,
  publishNewOrder,
  startMockProgression,
  stopMockProgression,
} from './order-hub';
