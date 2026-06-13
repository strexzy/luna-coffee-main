// Доменные типы каталога. Единый контракт: тип ответа мока === тип будущего
// ответа бэкенда (см. .claude/rules/mocks.md). Меняется только тело api-функции.

// Категория меню. «Все» в каталоге — это UI-фильтр, а не хранимая категория.
export interface Category {
  id: string;
  name: string;
}

// --- Опции конструктора напитка ---
// Описаны на уровне продукта, потому что это его домен. Виджет-конструктор
// (Фаза 5) их потребляет; каталожная карточка (Фаза 2) — нет.
// Заложены сразу, чтобы не менять контракт типов задним числом.

export type ProductSize = 'S' | 'M' | 'L';
export type MilkType = 'regular' | 'lactose-free' | 'oat' | 'almond';
export type DrinkTemperature = 'hot' | 'iced';

// Надбавка к базовой цене за выбор размера (0 — базовый размер).
export interface SizeOption {
  size: ProductSize;
  label: string;
  priceModifier: number;
}

// Надбавка за тип молока (растительное обычно дороже).
export interface MilkOption {
  type: MilkType;
  label: string;
  priceModifier: number;
}

// Дополнительный ингредиент (доп. эспрессо-шот, сироп) с фиксированной ценой.
export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

// Полный набор настраиваемых параметров напитка.
export interface DrinkOptions {
  sizes: SizeOption[];
  milkOptions: MilkOption[];
  temperatures: DrinkTemperature[];
  // Показывать ли регулятор уровня сладости.
  sweetnessAdjustable: boolean;
  extras: ExtraOption[];
}

// Рейтинг товара: значение и число оценок (★ 4.8 (230)).
export interface ProductRating {
  value: number;
  count: number;
}

// Выбор пользователя в конструкторе. milk/temperature/sweetness опциональны —
// их может не быть у конкретного продукта (десерт, чай без молока).
export interface DrinkSelection {
  size: ProductSize;
  milk?: MilkType;
  temperature?: DrinkTemperature;
  sweetness?: number; // 0..100
  extraIds: string[];
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  // Короткий подзаголовок в карточке («Плотная пенка»).
  shortDescription: string;
  // Полное описание для детального экрана.
  description: string;
  // Цена за базовый размер; итоговая считается с учётом опций.
  basePrice: number;
  imageUrl: string;
  rating: ProductRating;
  // Бейдж «Акция» в каталоге.
  isPromo?: boolean;
  // Опции кастомизации. Отсутствуют у ненастраиваемых позиций (десерты).
  options?: DrinkOptions;
}
