'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { MAX_CART_ITEM_QUANTITY, ROUTES } from '@shared/config';
import { formatPrice } from '@shared/lib';
import { selectCartTotal, useCartStore } from '@shared/store';
import type { CartItem } from '@shared/types';
import {
  Button,
  EmptyState,
  IconCart,
  IconMinus,
  IconPlus,
} from '@shared/ui';

export const CartView = () => {
  // Селективные подписки: ререндер только на нужный срез стора.
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectCartTotal);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <EmptyState
          icon={<IconCart className="size-6" size={24} />}
          title="Корзина пуста"
          description="Загляните в меню и выберите напиток."
          action={
            <Button asChild className="rounded-full">
              <Link href={ROUTES.menu}>Перейти в меню</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const summary = (
    <div className="flex items-center gap-4">
      <div className="leading-none">
        <p className="text-xs text-muted-foreground">Итого · {count} шт</p>
        <p className="text-2xl font-extrabold">{formatPrice(total)}</p>
      </div>
      <Button asChild className="h-12 flex-1 rounded-full text-base">
        <Link href={ROUTES.checkout}>К оформлению</Link>
      </Button>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-32 lg:pb-8">
      <h1 className="mb-5 text-3xl font-extrabold tracking-tight">Корзина</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:gap-8">
        {/* Список позиций */}
        <div className="divide-y divide-border/60 rounded-3xl bg-card px-4 ring-1 ring-border/50">
          {items.map((item) => (
            <CartRow key={item.id} item={item} />
          ))}
        </div>

        {/* Десктоп: липкая сводка-сайдбар */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-3xl bg-card p-5 ring-1 ring-border/50">
            <h2 className="font-bold">Ваш заказ</h2>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <span>Позиций</span>
              <span>{count} шт</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="font-semibold">Итого</span>
              <span className="text-xl font-extrabold">
                {formatPrice(total)}
              </span>
            </div>
            <Button asChild className="mt-4 h-12 w-full rounded-full text-base">
              <Link href={ROUTES.checkout}>К оформлению</Link>
            </Button>
          </div>
        </aside>
      </div>

      {/* Мобильные: липкая нижняя панель */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-5xl">{summary}</div>
      </div>
    </div>
  );
};

const CartRow = ({ item }: { item: CartItem }) => {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-3 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold">{item.name}</p>
            {item.optionsLabel ? (
              <p className="truncate text-sm text-muted-foreground">
                {item.optionsLabel}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Удалить"
            onClick={() => removeItem(item.id)}
            className="-mr-1 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
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
              <IconMinus className="size-4" size={16} />
            </Button>
            <span className="w-5 text-center font-semibold tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="size-8 rounded-full"
              aria-label="Увеличить"
              disabled={item.quantity >= MAX_CART_ITEM_QUANTITY}
              onClick={() => setQuantity(item.id, item.quantity + 1)}
            >
              <IconPlus className="size-4" size={16} />
            </Button>
          </div>
          <p className="font-bold">
            {formatPrice(item.unitPrice * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};
