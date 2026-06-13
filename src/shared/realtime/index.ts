// Публичный API сегмента shared/realtime.
export { useOrderSocket } from './use-order-socket';
export {
  subscribeOrderStatus,
  publishOrderStatus,
  startMockProgression,
  stopMockProgression,
} from './order-hub';
