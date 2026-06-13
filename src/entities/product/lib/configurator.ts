import type { CartItem } from '@shared/types';

import type { DrinkSelection, DrinkTemperature, Product } from '../model/types';

// Чистые функции конструктора: расчёт цены, подпись опций, сборка позиции
// корзины. Домен продукта, поэтому живут в entities/product (не дублируются
// в виджете-конструкторе и фиче add-to-cart).

const TEMPERATURE_LABELS: Record<DrinkTemperature, string> = {
  hot: 'горячий',
  iced: 'со льдом',
};

// Выбор по умолчанию: первый размер/молоко/температура, сладость 50%.
// TODO (Фаза 9): дефолтный размер сделать M, а не первый из списка (сейчас S).
// В макете по умолчанию подсвечен средний размер.
export const getDefaultSelection = (product: Product): DrinkSelection => {
  const options = product.options;
  return {
    size: options?.sizes[0]?.size ?? 'M',
    milk: options?.milkOptions[0]?.type,
    temperature: options?.temperatures[0],
    sweetness: options?.sweetnessAdjustable ? 50 : undefined,
    extraIds: [],
  };
};

// Итоговая цена за единицу: база + надбавки за размер, молоко и экстра.
// Температура и сладость на цену не влияют.
export const calcUnitPrice = (
  product: Product,
  selection: DrinkSelection,
): number => {
  const options = product.options;
  if (!options) {
    return product.basePrice;
  }
  let price = product.basePrice;
  price +=
    options.sizes.find((s) => s.size === selection.size)?.priceModifier ?? 0;
  if (selection.milk) {
    price +=
      options.milkOptions.find((m) => m.type === selection.milk)
        ?.priceModifier ?? 0;
  }
  for (const id of selection.extraIds) {
    price += options.extras.find((e) => e.id === id)?.price ?? 0;
  }
  return price;
};

// Человекочитаемая подпись выбранных опций для корзины и заказа.
export const buildOptionsLabel = (
  product: Product,
  selection: DrinkSelection,
): string | undefined => {
  const options = product.options;
  if (!options) {
    return undefined;
  }
  const parts: string[] = [selection.size];
  if (selection.milk) {
    const milk = options.milkOptions.find((m) => m.type === selection.milk);
    if (milk) parts.push(milk.label.toLowerCase());
  }
  if (selection.temperature) {
    parts.push(TEMPERATURE_LABELS[selection.temperature]);
  }
  for (const id of selection.extraIds) {
    const extra = options.extras.find((e) => e.id === id);
    if (extra) parts.push(extra.label.toLowerCase());
  }
  return parts.join(', ');
};

// Ключ позиции корзины: одинаковый продукт с одинаковым выбором → один id,
// поэтому повторное добавление суммируется (мердж в cart.store).
const buildCartItemId = (
  product: Product,
  selection: DrinkSelection,
): string => {
  const extras = [...selection.extraIds].sort().join('+');
  return [
    product.id,
    selection.size,
    selection.milk ?? '-',
    selection.temperature ?? '-',
    selection.sweetness ?? '-',
    extras || '-',
  ].join('|');
};

export const buildCartItem = (
  product: Product,
  selection: DrinkSelection,
  quantity: number,
): CartItem => ({
  id: buildCartItemId(product, selection),
  productId: product.id,
  name: product.name,
  imageUrl: product.imageUrl,
  unitPrice: calcUnitPrice(product, selection),
  quantity,
  optionsLabel: buildOptionsLabel(product, selection),
});
