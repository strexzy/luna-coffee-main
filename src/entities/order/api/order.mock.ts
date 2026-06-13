import type { Order } from '../model/types';

// Мок-заказы для очереди бариста и истории клиента. Разные статусы —
// чтобы проверить отображение всех состояний.

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-3435',
    number: 3435,
    items: [
      {
        productId: 'cappuccino',
        name: 'Капучино',
        unitPrice: 300,
        quantity: 1,
        optionsLabel: 'M, овсяное молоко',
        imageUrl: '/coffee/cappuccino.jpg',
      },
      {
        productId: 'flat-white',
        name: 'Флэт Уайт',
        unitPrice: 350,
        quantity: 1,
        imageUrl: '/coffee/flat-white.jpg',
      },
    ],
    totalPrice: 650,
    status: 'ready',
    pickupTime: '2026-06-13T19:02:00.000Z',
    createdAt: '2026-06-13T18:40:00.000Z',
    comment: 'Без сахара',
  },
  {
    id: 'order-3436',
    number: 3436,
    items: [
      {
        productId: 'latte',
        name: 'Латте',
        unitPrice: 300,
        quantity: 2,
        imageUrl: '/coffee/latte.jpg',
      },
    ],
    totalPrice: 600,
    status: 'preparing',
    pickupTime: '2026-06-13T19:15:00.000Z',
    createdAt: '2026-06-13T18:55:00.000Z',
  },
  {
    id: 'order-3437',
    number: 3437,
    items: [
      {
        productId: 'americano',
        name: 'Американо',
        unitPrice: 180,
        quantity: 1,
        imageUrl: '/coffee/americano.jpg',
      },
      {
        productId: 'croissant',
        name: 'Круассан',
        unitPrice: 150,
        quantity: 1,
        imageUrl: '/coffee/croissant.jpg',
      },
    ],
    totalPrice: 330,
    status: 'accepted',
    pickupTime: '2026-06-13T19:20:00.000Z',
    createdAt: '2026-06-13T19:05:00.000Z',
  },
  {
    id: 'order-3438',
    number: 3438,
    items: [
      {
        productId: 'matcha',
        name: 'Матча латте',
        unitPrice: 330,
        quantity: 1,
        optionsLabel: 'L, миндальное молоко',
        imageUrl: '/coffee/matcha.jpg',
      },
    ],
    totalPrice: 370,
    status: 'new',
    pickupTime: '2026-06-13T19:30:00.000Z',
    createdAt: '2026-06-13T19:12:00.000Z',
  },
];
