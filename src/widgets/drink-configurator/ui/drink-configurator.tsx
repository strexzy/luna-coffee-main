'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import {
  calcUnitPrice,
  getDefaultSelection,
  type DrinkSelection,
  type DrinkTemperature,
  type MilkType,
  type Product,
  type ProductSize,
} from '@entities/product';
import { AddToCartButton } from '@features/add-to-cart';
import { ROUTES } from '@shared/config';
import { cn, formatPrice } from '@shared/lib';
import { IconArrowLeft, IconStar, Slider, Switch } from '@shared/ui';

interface Props {
  product: Product;
}

const TEMPERATURE_LABELS: Record<DrinkTemperature, string> = {
  hot: 'Горячий',
  iced: 'Со льдом',
};

// Конструктор напитка: выбор опций с автоматическим пересчётом стоимости
// (ТЗ п. 3.3). Десктоп — две колонки (фото + параметры), мобильные — одна
// колонка с липкой панелью действия снизу. Десерты без опций — только описание.
export const DrinkConfigurator = ({ product }: Props) => {
  const [selection, setSelection] = useState<DrinkSelection>(() =>
    getDefaultSelection(product),
  );
  const options = product.options;
  const unitPrice = calcUnitPrice(product, selection);

  const setSize = (size: ProductSize) => setSelection((s) => ({ ...s, size }));
  const setMilk = (milk: MilkType) => setSelection((s) => ({ ...s, milk }));
  const setTemperature = (temperature: DrinkTemperature) =>
    setSelection((s) => ({ ...s, temperature }));
  const setSweetness = (sweetness: number) =>
    setSelection((s) => ({ ...s, sweetness }));
  const toggleExtra = (id: string) =>
    setSelection((s) => ({
      ...s,
      extraIds: s.extraIds.includes(id)
        ? s.extraIds.filter((x) => x !== id)
        : [...s.extraIds, id],
    }));

  // Блок «цена + в корзину» — на десктопе внизу правой колонки, на мобильных
  // в липкой панели. Рендерим оба, видимость переключаем по брейкпоинту.
  const priceAction = (
    <div className="flex items-center gap-4">
      <div className="leading-none">
        <p className="text-xs text-muted-foreground">Цена</p>
        <p className="text-2xl font-extrabold">{formatPrice(unitPrice)}</p>
      </div>
      <AddToCartButton
        product={product}
        selection={selection}
        variant="full"
        className="h-12 flex-1 rounded-full text-base"
      />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-32 md:pb-8">
      <Link
        href={ROUTES.menu}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="size-5" size={20} />
        Меню
      </Link>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* Левая колонка: фото + описание (липкое на десктопе) */}
        <div className="md:sticky md:top-20 md:self-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-sm">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-5 hidden md:block">
            <h2 className="font-bold">Описание</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        {/* Правая колонка: имя, рейтинг, параметры */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 font-semibold">
              <IconStar className="size-4 text-amber-400" size={16} />
              {product.rating.value.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              · {product.rating.count} оценок
            </span>
          </div>
          <p className="mt-3 text-muted-foreground md:hidden">
            {product.description}
          </p>

          {options ? (
            <div className="mt-6 space-y-7">
              {options.sizes.length > 0 ? (
                <Group title="Размер">
                  <div className="grid grid-cols-3 gap-2">
                    {options.sizes.map((s) => (
                      <OptionButton
                        key={s.size}
                        active={selection.size === s.size}
                        onClick={() => setSize(s.size)}
                        className="justify-center"
                      >
                        {s.label}
                      </OptionButton>
                    ))}
                  </div>
                </Group>
              ) : null}

              {options.milkOptions.length > 0 ? (
                <Group title="Молоко">
                  <div className="space-y-2">
                    {options.milkOptions.map((m) => (
                      <OptionButton
                        key={m.type}
                        active={selection.milk === m.type}
                        onClick={() => setMilk(m.type)}
                        className="w-full justify-between"
                      >
                        <span>{m.label}</span>
                        {m.priceModifier > 0 ? (
                          <span className="text-sm text-muted-foreground">
                            +{formatPrice(m.priceModifier)}
                          </span>
                        ) : null}
                      </OptionButton>
                    ))}
                  </div>
                </Group>
              ) : null}

              {options.temperatures.length > 0 ? (
                <Group title="Температура">
                  <div className="grid grid-cols-2 gap-2">
                    {options.temperatures.map((t) => (
                      <OptionButton
                        key={t}
                        active={selection.temperature === t}
                        onClick={() => setTemperature(t)}
                        className="justify-center"
                      >
                        {TEMPERATURE_LABELS[t]}
                      </OptionButton>
                    ))}
                  </div>
                </Group>
              ) : null}

              {options.sweetnessAdjustable ? (
                <Group
                  title="Уровень сладости"
                  aside={`${selection.sweetness ?? 0}%`}
                >
                  <Slider
                    value={[selection.sweetness ?? 0]}
                    onValueChange={(v) => setSweetness(v[0] ?? 0)}
                    min={0}
                    max={100}
                    step={5}
                    className="py-1"
                  />
                </Group>
              ) : null}

              {options.extras.length > 0 ? (
                <Group title="Дополнительно">
                  <div className="space-y-2">
                    {options.extras.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{extra.label}</p>
                          <p className="text-sm text-muted-foreground">
                            +{formatPrice(extra.price)}
                          </p>
                        </div>
                        <Switch
                          checked={selection.extraIds.includes(extra.id)}
                          onCheckedChange={() => toggleExtra(extra.id)}
                        />
                      </div>
                    ))}
                  </div>
                </Group>
              ) : null}
            </div>
          ) : (
            <p className="mt-6 text-muted-foreground">
              Готовый десерт — без дополнительной настройки.
            </p>
          )}

          {/* Десктоп: цена + добавить внизу правой колонки */}
          <div className="mt-8 hidden border-t border-border/60 pt-5 md:block">
            {priceAction}
          </div>
        </div>
      </div>

      {/* Мобильные: липкая панель действия над нижней навигацией */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto max-w-5xl">{priceAction}</div>
      </div>
    </div>
  );
};

const Group = ({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: string;
  children: React.ReactNode;
}) => (
  <section>
    <div className="mb-2.5 flex items-center justify-between">
      <h2 className="font-bold">{title}</h2>
      {aside ? (
        <span className="text-sm font-semibold text-primary">{aside}</span>
      ) : null}
    </div>
    {children}
  </section>
);

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const OptionButton = ({
  active,
  onClick,
  className,
  children,
}: OptionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex items-center rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
      active
        ? 'border-primary bg-primary/5 text-foreground shadow-sm'
        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
      className,
    )}
  >
    {children}
  </button>
);
