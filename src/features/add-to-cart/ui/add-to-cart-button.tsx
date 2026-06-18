'use client';

import type { DrinkSelection, Product } from '@entities/product';
import { cn } from '@shared/lib';
import { Button, IconPlus } from '@shared/ui';

import { useAddToCart } from '../model/use-add-to-cart';

interface Props {
  product: Product;
  // Конкретный выбор из конструктора; без него — дефолтный набор.
  selection?: DrinkSelection;
  quantity?: number;
  // icon — круглая «+» для каталога; full — кнопка с подписью для конструктора.
  variant?: 'icon' | 'full';
  label?: string;
  className?: string;
}

export const AddToCartButton = ({
  product,
  selection,
  quantity = 1,
  variant = 'icon',
  label = 'В корзину',
  className,
}: Props) => {
  const addToCart = useAddToCart();
  const handleClick = () => addToCart(product, selection, quantity);

  if (variant === 'icon') {
    return (
      <Button
        type="button"
        size="icon"
        aria-label={label}
        onClick={handleClick}
        className={cn('size-9 rounded-full shadow-sm', className)}
      >
        <IconPlus className="size-5" size={20} />
      </Button>
    );
  }

  return (
    <Button type="button" onClick={handleClick} className={className}>
      {label}
    </Button>
  );
};
