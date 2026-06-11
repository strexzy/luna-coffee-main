import { create } from 'zustand';

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
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  setQuantity: (id, quantity) =>
    set((state) => ({
      // Количество < 1 не имеет смысла — такие значения отбрасываем.
      items:
        quantity < 1
          ? state.items
          : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clear: () => set({ items: [] }),
}));

// Селектор итоговой суммы. Вынесен функцией, чтобы компоненты подписывались
// селективно: useCartStore(selectCartTotal).
export const selectCartTotal = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
