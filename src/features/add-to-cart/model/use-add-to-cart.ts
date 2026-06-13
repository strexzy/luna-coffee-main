'use client';

import {
  buildCartItem,
  getDefaultSelection,
  type DrinkSelection,
  type Product,
} from '@entities/product';
import { useCartStore } from '@shared/store';
import { toast } from '@shared/ui';

// Добавление в корзину с учётом опций. Без выбора (быстрое «+» в каталоге)
// берём дефолтный набор. Мердж одинаковых позиций — внутри cart.store.
export const useAddToCart = (): ((
  product: Product,
  selection?: DrinkSelection,
  quantity?: number,
) => void) => {
  const addItem = useCartStore((s) => s.addItem);

  return (product, selection, quantity = 1) => {
    const finalSelection = selection ?? getDefaultSelection(product);
    addItem(buildCartItem(product, finalSelection, quantity));
    toast.success(`${product.name} — добавлено в корзину`);
  };
};
