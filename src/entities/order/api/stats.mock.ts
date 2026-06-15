// Детерминированный мок-генератор истории заказов для статистики админки.
// FSD: entities/order не может импортировать entities/product (сиблинг),
// поэтому компактный список товаров продублирован здесь — только для мока.

interface StatProduct {
  productId: string;
  name: string;
  price: number;
}

const STATS_PRODUCTS: StatProduct[] = [
  { productId: 'cappuccino', name: 'Капучино', price: 250 },
  { productId: 'flat-white', name: 'Флэт Уайт', price: 350 },
  { productId: 'latte', name: 'Латте', price: 300 },
  { productId: 'raf', name: 'Раф', price: 320 },
  { productId: 'americano', name: 'Американо', price: 180 },
  { productId: 'matcha', name: 'Матча латте', price: 330 },
  { productId: 'oolong', name: 'Улун', price: 220 },
  { productId: 'croissant', name: 'Круассан', price: 150 },
];

// Линейный конгруэнтный генератор: детерминированно, без Math.random — данные
// одинаковы на сервере и клиенте (нет расхождения гидрации) и стабильны между
// запросами.
const createRng = (seed: number): (() => number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

export interface HistoryOrder {
  createdAt: string;
  total: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

const HISTORY_DAYS = 35;

// История заказов за последние HISTORY_DAYS дней относительно anchor.
export const generateOrderHistory = (anchor: Date): HistoryOrder[] => {
  const rng = createRng(20260601); // фиксированный seed → стабильная история
  const orders: HistoryOrder[] = [];

  for (let d = 0; d < HISTORY_DAYS; d += 1) {
    const day = new Date(anchor);
    day.setUTCDate(day.getUTCDate() - d);
    const ordersCount = 4 + Math.floor(rng() * 16); // 4..19 заказов в день

    for (let i = 0; i < ordersCount; i += 1) {
      const itemsCount = 1 + Math.floor(rng() * 3); // 1..3 позиции
      const items: HistoryOrder['items'] = [];
      let total = 0;
      for (let k = 0; k < itemsCount; k += 1) {
        const product =
          STATS_PRODUCTS[Math.floor(rng() * STATS_PRODUCTS.length)];
        const quantity = 1 + Math.floor(rng() * 2); // 1..2
        const revenue = product.price * quantity;
        total += revenue;
        items.push({
          productId: product.productId,
          name: product.name,
          quantity,
          revenue,
        });
      }
      const created = new Date(day);
      created.setUTCHours(8 + Math.floor(rng() * 12), Math.floor(rng() * 60));
      orders.push({ createdAt: created.toISOString(), total, items });
    }
  }

  return orders;
};
