'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  getCategories,
  getProducts,
  type Category,
  type Product,
} from '@entities/product';
import { ApiError } from '@shared/api';

interface UseCatalog {
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
  search: string;
  setSearch: (value: string) => void;
}

// Загрузка каталога и клиентская фильтрация по категории + поиску.
// Состояния загрузки/ошибки держим здесь, UI остаётся тонким (соглашения).
export const useCatalog = (): UseCatalog => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Эффект выполняется один раз; начальные isLoading=true/error=null уже
    // верны, поэтому синхронный сброс состояния здесь не нужен.
    let active = true;
    Promise.all([getProducts(), getCategories()])
      .then(([products, cats]) => {
        if (!active) return;
        setAllProducts(products);
        setCategories(cats);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(
          e instanceof ApiError ? e.message : 'Не удалось загрузить меню',
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allProducts.filter(
      (p) =>
        (categoryId === null || p.categoryId === categoryId) &&
        (query === '' || p.name.toLowerCase().includes(query)),
    );
  }, [allProducts, categoryId, search]);

  return {
    categories,
    products,
    isLoading,
    error,
    categoryId,
    setCategoryId,
    search,
    setSearch,
  };
};
