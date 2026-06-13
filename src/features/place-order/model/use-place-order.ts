'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createOrder } from '@entities/order';
import { ApiError } from '@shared/api';
import { ROUTES } from '@shared/config';
import { useActiveOrderStore, useCartStore } from '@shared/store';
import { toast } from '@shared/ui';

import type { CheckoutValues } from './checkout.schema';

interface UsePlaceOrder {
  submit: (values: CheckoutValues) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export const usePlaceOrder = (): UsePlaceOrder => {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const setActiveOrder = useActiveOrderStore((s) => s.setActiveOrder);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: CheckoutValues): Promise<void> => {
    if (items.length === 0) {
      setError('Корзина пуста');
      return;
    }
    setIsPending(true);
    setError(null);
    try {
      const order = await createOrder({
        // Снимок позиций корзины в состав заказа (без ключа мерджа).
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          imageUrl: i.imageUrl,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          optionsLabel: i.optionsLabel,
        })),
        pickupTime: new Date(values.pickupTime).toISOString(),
        comment: values.comment,
      });
      setActiveOrder(order.id, order.status);
      clearCart();
      toast.success(`Заказ № ${order.number} оформлен`);
      router.replace(ROUTES.order(order.id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Не удалось оформить заказ');
    } finally {
      setIsPending(false);
    }
  };

  return { submit, isPending, error };
};
