import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { formatPrice } from '@shared/lib';
import { IconStar } from '@shared/ui';

import type { Product } from '../model/types';

interface Props {
  product: Product;
  // Ссылка на детальный экран. Если задана — изображение и описание кликабельны
  // (кнопка действия остаётся отдельно, чтобы «+» не вызывал переход).
  href?: string;
  // Слот действия (кнопка «+»). Внедряется фичей add-to-cart на уровне
  // виджета/страницы: entity не знает про корзину.
  action?: ReactNode;
}

// Каталожная карточка товара. Презентационная и самодостаточная.
export const ProductCard = ({ product, href, action }: Props) => {
  const media = (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Рейтинг поверх изображения (★ 4.8). */}
      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold shadow-sm backdrop-blur">
        <IconStar className="size-3.5 text-amber-400" size={14} />
        {product.rating.value.toFixed(1)}
      </span>
      {product.isPromo ? (
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
          Акция
        </span>
      ) : null}
    </div>
  );

  const info = (
    <div className="px-1 pt-2.5">
      <h3 className="font-bold leading-tight">{product.name}</h3>
      <p className="line-clamp-1 text-xs text-muted-foreground">
        {product.shortDescription}
      </p>
    </div>
  );

  return (
    <div className="group rounded-3xl bg-card p-2.5 shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md">
      {href ? (
        <Link href={href} className="block">
          {media}
          {info}
        </Link>
      ) : (
        <>
          {media}
          {info}
        </>
      )}

      <div className="mt-2.5 flex items-center justify-between px-1">
        <span className="text-lg font-extrabold">
          {formatPrice(product.basePrice)}
        </span>
        {action}
      </div>
    </div>
  );
};
