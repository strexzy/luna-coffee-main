'use client';

import { Search } from 'lucide-react';

import { ProductCard } from '@entities/product';
import { AddToCartButton } from '@features/add-to-cart';
import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { Button, EmptyState, Input, Skeleton } from '@shared/ui';

import { useCatalog } from '../model/use-catalog';

export const MenuCatalog = () => {
  const {
    categories,
    products,
    isLoading,
    error,
    categoryId,
    setCategoryId,
    search,
    setSearch,
  } = useCatalog();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Меню</h1>

      {/* Поиск */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию"
          className="pl-9"
        />
      </div>

      {/* Категории */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryChip
          active={categoryId === null}
          onClick={() => setCategoryId(null)}
        >
          Все
        </CategoryChip>
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            active={categoryId === c.id}
            onClick={() => setCategoryId(c.id)}
          >
            {c.name}
          </CategoryChip>
        ))}
      </div>

      {/* Состояния */}
      {isLoading ? (
        <CatalogSkeleton />
      ) : error ? (
        <EmptyState
          title="Ошибка загрузки"
          description={error}
          action={
            <Button onClick={() => location.reload()} variant="outline">
              Обновить
            </Button>
          }
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте изменить запрос или категорию."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={ROUTES.product(product.id)}
              action={<AddToCartButton product={product} />}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const CategoryChip = ({ active, onClick, children }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-full border px-4 py-1.5 text-sm transition-colors',
      active
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-background text-muted-foreground hover:text-foreground',
    )}
  >
    {children}
  </button>
);

const CatalogSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);
