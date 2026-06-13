import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { ReactNode } from 'react';

import { formatPrice } from '@shared/lib';
import { Card } from '@shared/ui';

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
    <div className="relative aspect-square w-full">
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover"
      />
      {/* Рейтинг поверх изображения (★ 4.8). */}
      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium">
        <Star className="size-3 fill-yellow-400 text-yellow-400" />
        {product.rating.value.toFixed(1)}
      </span>
      {product.isPromo ? (
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          Акция
        </span>
      ) : null}
    </div>
  );

  const info = (
    <div className="px-3 pt-3">
      <h3 className="font-semibold leading-tight">{product.name}</h3>
      <p className="text-sm text-muted-foreground">
        {product.shortDescription}
      </p>
    </div>
  );

  return (
    <Card className="gap-0 overflow-hidden p-0">
      {href ? (
        <Link href={href} className="block transition-opacity hover:opacity-90">
          {media}
          {info}
        </Link>
      ) : (
        <>
          {media}
          {info}
        </>
      )}

      <div className="mt-2 flex items-center justify-between px-3 pb-3">
        <span className="font-bold">{formatPrice(product.basePrice)}</span>
        {action}
      </div>
    </Card>
  );
};
