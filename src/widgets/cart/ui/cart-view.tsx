'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

import { ROUTES } from '@shared/config';
import { formatPrice } from '@shared/lib';
import { selectCartTotal, useCartStore } from '@shared/store';
import type { CartItem } from '@shared/types';
import { Button, EmptyState } from '@shared/ui';

export const CartView = () => {
  // Селективные подписки: ререндер только на нужный срез стора.
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState
          icon={<ShoppingBag className="size-6" />}
          title="Корзина пуста"
          description="Загляните в меню и выберите напиток."
          action={
            <Button asChild>
              <Link href={ROUTES.menu}>Перейти в меню</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Корзина</h1>

      <div className="divide-y">
        {items.map((item) => (
          <CartRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground">Сумма заказа</span>
        <span className="text-xl font-bold">{formatPrice(total)}</span>
      </div>

      <Button asChild className="mt-6 h-12 w-full text-base">
        <Link href={ROUTES.checkout}>К оформлению</Link>
      </Button>
    </div>
  );
};

const CartRow = ({ item }: { item: CartItem }) => {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium">{item.name}</p>
        {item.optionsLabel ? (
          <p className="truncate text-sm text-muted-foreground">
            {item.optionsLabel}
          </p>
        ) : null}
        <p className="text-sm font-semibold">{formatPrice(item.unitPrice)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="size-8 rounded-full"
          aria-label="Уменьшить"
          disabled={item.quantity <= 1}
          onClick={() => setQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-5 text-center tabular-nums">{item.quantity}</span>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="size-8 rounded-full"
          aria-label="Увеличить"
          onClick={() => setQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-8 text-muted-foreground"
          aria-label="Удалить"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
