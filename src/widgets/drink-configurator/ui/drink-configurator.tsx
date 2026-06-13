'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
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
import { cn, formatPrice } from '@shared/lib';
import { Slider, Switch } from '@shared/ui';

interface Props {
  product: Product;
}

const TEMPERATURE_LABELS: Record<DrinkTemperature, string> = {
  hot: 'Горячий',
  iced: 'Со льдом',
};

// Конструктор напитка: выбор опций с автоматическим пересчётом стоимости
// (ТЗ п. 3.3). Десерты без опций показывают только описание и цену.
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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
          priority
        />
      </div>

      <div className="mb-1 flex items-center gap-2">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
          {product.rating.value.toFixed(1)} ({product.rating.count})
        </span>
      </div>
      <p className="mb-6 text-muted-foreground">{product.description}</p>

      {options ? (
        <div className="space-y-6">
          {options.sizes.length > 0 ? (
            <Group title="Размер">
              <div className="flex gap-2">
                {options.sizes.map((s) => (
                  <OptionButton
                    key={s.size}
                    active={selection.size === s.size}
                    onClick={() => setSize(s.size)}
                    className="flex-1"
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
                      <span className="text-muted-foreground">
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
              <div className="flex gap-2">
                {options.temperatures.map((t) => (
                  <OptionButton
                    key={t}
                    active={selection.temperature === t}
                    onClick={() => setTemperature(t)}
                    className="flex-1"
                  >
                    {TEMPERATURE_LABELS[t]}
                  </OptionButton>
                ))}
              </div>
            </Group>
          ) : null}

          {options.sweetnessAdjustable ? (
            <Group title={`Уровень сладости — ${selection.sweetness ?? 0}%`}>
              <Slider
                value={[selection.sweetness ?? 0]}
                onValueChange={(v) => setSweetness(v[0] ?? 0)}
                min={0}
                max={100}
                step={5}
              />
            </Group>
          ) : null}

          {options.extras.length > 0 ? (
            <Group title="Дополнительно">
              <div className="space-y-3">
                {options.extras.map((extra) => (
                  <div
                    key={extra.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p>{extra.label}</p>
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
      ) : null}

      {/* Итоговая стоимость + добавление с текущим выбором */}
      <div className="mt-8 flex items-center justify-between gap-4 border-t pt-4">
        <div>
          <p className="text-sm text-muted-foreground">Цена</p>
          <p className="text-2xl font-bold">{formatPrice(unitPrice)}</p>
        </div>
        <AddToCartButton
          product={product}
          selection={selection}
          variant="full"
          className="h-12 flex-1 text-base"
        />
      </div>
    </div>
  );
};

const Group = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2 className="mb-2 font-semibold">{title}</h2>
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
      'flex items-center rounded-lg border px-4 py-2.5 text-sm transition-colors',
      active
        ? 'border-primary bg-primary/5 text-foreground'
        : 'border-border text-muted-foreground hover:text-foreground',
      className,
    )}
  >
    {children}
  </button>
);
