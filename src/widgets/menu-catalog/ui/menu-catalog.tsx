'use client';

import { ProductCard } from '@entities/product';
import { AddToCartButton } from '@features/add-to-cart';
import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import {
  Button,
  EmptyState,
  IconSearch,
  Input,
  Reveal,
  Skeleton,
} from '@shared/ui';

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
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">Меню</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Выберите напиток и соберите его под себя
      </p>

      {/* Поиск */}
      <div className="relative mb-5">
        <IconSearch
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию"
          className="h-12 rounded-full border-transparent bg-secondary pl-12 text-base shadow-sm"
        />
      </div>

      {/* Категории — горизонтальный скролл, как в макете */}
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 8) * 0.05}>
              <ProductCard
                product={product}
                href={ROUTES.product(product.id)}
                action={<AddToCartButton product={product} />}
              />
            </Reveal>
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
      'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
      active
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'bg-secondary text-secondary-foreground hover:bg-accent',
    )}
  >
    {children}
  </button>
);

const CatalogSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="rounded-3xl bg-card p-2.5 ring-1 ring-border/50">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="mt-2.5 h-4 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </div>
    ))}
  </div>
);
