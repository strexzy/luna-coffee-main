import { OrderStatus } from '@widgets/order-status';

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Заказ грузится на клиенте (только что оформленный заказ живёт в мок-памяти
  // клиента, серверный инстанс моков его не видит) — см. useOrder.
  const { id } = await params;
  return <OrderStatus orderId={id} />;
}
