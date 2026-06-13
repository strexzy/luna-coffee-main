import type {
  Category,
  DrinkOptions,
  MilkOption,
  Product,
  SizeOption,
} from '../model/types';

// Мок-данные каталога. Картинки — из ассетов Figma, перенесены в public/coffee.
// Когда появится бэкенд, эти константы удаляются, остаётся только ветка axios
// в product.api.ts.

export const MOCK_CATEGORIES: Category[] = [
  { id: 'coffee', name: 'Кофе' },
  { id: 'tea', name: 'Чай' },
  { id: 'dessert', name: 'Десерты' },
];

// Базовые наборы опций переиспользуются между напитками — так мок ближе
// к реальности (общий прайс надбавок), чем уникальные опции у каждого товара.
const SIZE_OPTIONS: SizeOption[] = [
  { size: 'S', label: 'S', priceModifier: -30 },
  { size: 'M', label: 'M', priceModifier: 0 },
  { size: 'L', label: 'L', priceModifier: 40 },
];

const MILK_OPTIONS: MilkOption[] = [
  { type: 'regular', label: 'Обычное молоко', priceModifier: 0 },
  { type: 'lactose-free', label: 'Молоко 2%', priceModifier: 0 },
  { type: 'oat', label: 'Овсяное молоко', priceModifier: 50 },
  { type: 'almond', label: 'Миндальное молоко', priceModifier: 60 },
];

// Полный конструктор молочного напитка (как на детальном экране капучино).
const MILK_DRINK_OPTIONS: DrinkOptions = {
  sizes: SIZE_OPTIONS,
  milkOptions: MILK_OPTIONS,
  temperatures: ['hot', 'iced'],
  sweetnessAdjustable: true,
  extras: [{ id: 'extra-shot', label: 'Доп. эспрессо шот', price: 50 }],
};

// Напиток без молока (американо, чай): размеры и температура есть, молока нет.
const NO_MILK_DRINK_OPTIONS: DrinkOptions = {
  sizes: SIZE_OPTIONS,
  milkOptions: [],
  temperatures: ['hot', 'iced'],
  sweetnessAdjustable: true,
  extras: [{ id: 'extra-shot', label: 'Доп. эспрессо шот', price: 50 }],
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'cappuccino',
    name: 'Капучино',
    categoryId: 'coffee',
    shortDescription: 'Плотная пенка',
    description:
      'Капучино — это напиток объёмом примерно 180 мл (6 унций), состоящий ' +
      'из 25 мл эспрессо и 85 мл свежего молока, взбитого в плотную пенку.',
    basePrice: 250,
    imageUrl: '/coffee/cappuccino.jpg',
    rating: { value: 4.8, count: 230 },
    isPromo: true,
    options: MILK_DRINK_OPTIONS,
  },
  {
    id: 'flat-white',
    name: 'Флэт Уайт',
    categoryId: 'coffee',
    shortDescription: 'Эспрессо-напиток',
    description:
      'Флэт Уайт — кофейный напиток на основе двойного эспрессо с тонким ' +
      'слоем подогретого молока и минимальной молочной пеной.',
    basePrice: 350,
    imageUrl: '/coffee/flat-white.jpg',
    rating: { value: 4.7, count: 184 },
    options: MILK_DRINK_OPTIONS,
  },
  {
    id: 'latte',
    name: 'Латте',
    categoryId: 'coffee',
    shortDescription: 'Нежный и молочный',
    description:
      'Латте — кофейный напиток с большим количеством подогретого молока ' +
      'и тонким слоем молочной пены поверх эспрессо.',
    basePrice: 300,
    imageUrl: '/coffee/latte.jpg',
    rating: { value: 4.9, count: 312 },
    options: MILK_DRINK_OPTIONS,
  },
  {
    id: 'raf',
    name: 'Раф',
    categoryId: 'coffee',
    shortDescription: 'Сливочный вкус',
    description:
      'Раф — нежный кофейный напиток из эспрессо, сливок и ванильного ' +
      'сахара, взбитых вместе на пару.',
    basePrice: 320,
    imageUrl: '/coffee/raf.jpg',
    rating: { value: 4.8, count: 156 },
    options: MILK_DRINK_OPTIONS,
  },
  {
    id: 'americano',
    name: 'Американо',
    categoryId: 'coffee',
    shortDescription: 'Чёрный кофе',
    description:
      'Американо — эспрессо, разбавленный горячей водой до объёма обычной ' +
      'чашки кофе.',
    basePrice: 180,
    imageUrl: '/coffee/americano.jpg',
    rating: { value: 4.6, count: 98 },
    options: NO_MILK_DRINK_OPTIONS,
  },
  {
    id: 'matcha',
    name: 'Матча латте',
    categoryId: 'tea',
    shortDescription: 'Японский чай',
    description:
      'Матча латте — напиток из порошкового зелёного чая матча, взбитого ' +
      'с подогретым молоком.',
    basePrice: 330,
    imageUrl: '/coffee/matcha.jpg',
    rating: { value: 4.7, count: 142 },
    options: MILK_DRINK_OPTIONS,
  },
  {
    id: 'oolong',
    name: 'Улун',
    categoryId: 'tea',
    shortDescription: 'Полуферментированный чай',
    description:
      'Улун — традиционный китайский полуферментированный чай с мягким ' +
      'вкусом и цветочным ароматом.',
    basePrice: 220,
    imageUrl: '/coffee/oolong.jpg',
    rating: { value: 4.5, count: 76 },
    options: NO_MILK_DRINK_OPTIONS,
  },
  {
    id: 'croissant',
    name: 'Круассан',
    categoryId: 'dessert',
    shortDescription: 'Свежая выпечка',
    description:
      'Классический французский круассан из слоёного теста, выпекается ' +
      'каждое утро.',
    basePrice: 150,
    imageUrl: '/coffee/croissant.jpg',
    rating: { value: 4.9, count: 204 },
    // Десерт не настраивается — опций нет.
  },
];
