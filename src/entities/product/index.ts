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
} from './model/types';
export { getProducts, getProductById, getCategories } from './api/product.api';
export { ProductCard } from './ui/product-card';
