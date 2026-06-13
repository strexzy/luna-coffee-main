import { apiInstance, ApiError, withDelay } from '@shared/api';
import { USE_MOCKS } from '@shared/config';

import type { Category, Product } from '../model/types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './product.mock';

// API каталога. Компоненты вызывают эти функции, не зная про моки —
// переключение реальный/мок инкапсулировано здесь (см. .claude/rules/mocks.md).

export const getProducts = async (categoryId?: string): Promise<Product[]> => {
  if (USE_MOCKS) {
    const products = categoryId
      ? MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId)
      : MOCK_PRODUCTS;
    return withDelay(products);
  }
  const { data } = await apiInstance.get<Product[]>('/products', {
    params: { category: categoryId },
  });
  return data;
};

export const getProductById = async (id: string): Promise<Product> => {
  if (USE_MOCKS) {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new ApiError('Товар не найден', 404);
    }
    return withDelay(product);
  }
  const { data } = await apiInstance.get<Product>(`/products/${id}`);
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  if (USE_MOCKS) {
    return withDelay(MOCK_CATEGORIES);
  }
  const { data } = await apiInstance.get<Category[]>('/categories');
  return data;
};
