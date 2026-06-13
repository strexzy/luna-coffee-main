// Публичный API слайса entities/product.
export type {
  Product,
  Category,
  ProductRating,
  DrinkOptions,
  SizeOption,
  MilkOption,
  ExtraOption,
  ProductSize,
  MilkType,
  DrinkTemperature,
  DrinkSelection,
} from './model/types';
export { getProducts, getProductById, getCategories } from './api/product.api';
export {
  getDefaultSelection,
  calcUnitPrice,
  buildOptionsLabel,
  buildCartItem,
} from './lib/configurator';
export { ProductCard } from './ui/product-card';
