import { create } from 'zustand';

import { MAX_CART_ITEM_QUANTITY } from '@shared/config';
import type { CartItem } from '@shared/types';

// Заготовка стора корзины. Полная логика (мердж позиций с одинаковыми
// опциями конструктора) появится в фазе 5 — здесь базовый контракт.

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  // Позиция с уже существующим id суммируется по количеству —
  // id формируется из товара и опций, одинаковый id === одинаковая позиция.
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  // Не выше предела позиции (ревью-аудит).
                  quantity: Math.min(
                    i.quantity + item.quantity,
                    MAX_CART_ITEM_QUANTITY,
                  ),
                }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setQuantity: (id, quantity) =>
    set((state) => {
      // Вне диапазона [1, MAX] игнорируем — кнопки в UI и так ограничены.
      if (quantity < 1 || quantity > MAX_CART_ITEM_QUANTITY) return state;
      return {
        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      };
    }),
  clear: () => set({ items: [] }),
}));

// Селектор итоговой суммы. Вынесен функцией, чтобы компоненты подписывались
// селективно: useCartStore(selectCartTotal).
export const selectCartTotal = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
