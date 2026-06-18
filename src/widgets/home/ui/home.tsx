import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin, SlidersHorizontal } from 'lucide-react';

import { getProducts, ProductCard } from '@entities/product';
import { AddToCartButton } from '@features/add-to-cart';
import { ROUTES } from '@shared/config';
import { Button, IconStar, Reveal } from '@shared/ui';

// Карточки категорий с репрезентативной картинкой (ведут в меню).
const CATEGORY_CARDS = [
  { name: 'Кофе', image: '/coffee/cappuccino.jpg' },
  { name: 'Чай', image: '/coffee/matcha.jpg' },
  { name: 'Десерты', image: '/coffee/croissant.jpg' },
];

// Ценности бренда — три коротких пункта с иконками.
const VALUE_PROPS = [
  {
    Icon: SlidersHorizontal,
    title: 'Соберите под себя',
    text: 'Размер, молоко, сладость и добавки — в конструкторе напитка.',
  },
  {
    Icon: Clock,
    title: 'Без очереди',
    text: 'Оформите заранее и заберите к удобному времени.',
  },
  {
    Icon: MapPin,
    title: 'Самовывоз',
    text: 'Луна Кофе, ул. Свердлова 56 — совсем рядом.',
  },
];

// Главная: витрина бренда. Server-компонент — данные тянем на сервере, точечные
// анимации появления делает клиентский Reveal вокруг секций.
export const Home = async () => {
  const products = await getProducts();
  const popular = [...products]
    .sort((a, b) => b.rating.value - a.rating.value)
    .slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Герой */}
      <Reveal>
        <section className="relative h-[440px] overflow-hidden rounded-3xl md:h-[480px]">
          <Image
            src="/coffee/hero-bg.jpg"
            alt="Чашка кофе «Луна Кофе»"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-4 p-6 text-white md:p-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <IconStar className="size-3.5 text-amber-300" size={14} />
              4.8 · больше 1000 заказов
            </span>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Ваш кофе
              <br />
              под вашу луну
            </h1>
            <p className="max-w-md text-white/85 md:text-lg">
              Соберите идеальный напиток под себя и заберите без очереди.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-1 h-12 rounded-full px-7 text-base shadow-lg"
            >
              <Link href={ROUTES.menu}>Открыть меню</Link>
            </Button>
          </div>
        </section>
      </Reveal>

      {/* Промо-баннер */}
      <Reveal delay={0.05}>
        <Link href={ROUTES.menu} className="mt-5 block">
          <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-7 text-primary-foreground md:px-8">
            <div className="absolute -top-10 -right-8 size-40 rounded-full bg-white/10" />
            <div className="absolute right-16 -bottom-12 size-28 rounded-full bg-white/10" />
            <div className="relative max-w-[68%]">
              <p className="text-xs font-semibold tracking-wide text-primary-foreground/80 uppercase">
                Акция недели
              </p>
              <p className="mt-1 text-2xl font-extrabold leading-tight md:text-3xl">
                Купи один — второй в подарок
              </p>
              <p className="mt-2 text-sm text-primary-foreground/85">
                На все напитки по будням до 12:00.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Выбрать напиток →
              </span>
            </div>
            <Image
              src="/coffee/latte.jpg"
              alt=""
              width={128}
              height={128}
              className="absolute -right-2 bottom-3 size-28 rounded-2xl object-cover opacity-95 shadow-lg md:size-32"
            />
          </section>
        </Link>
      </Reveal>

      {/* Популярное */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight">Популярное</h2>
          <Link
            href={ROUTES.menu}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Всё меню →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {popular.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <ProductCard
                product={product}
                href={ROUTES.product(product.id)}
                action={<AddToCartButton product={product} />}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Категории */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight">Категории</h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORY_CARDS.map((c) => (
            <Link
              key={c.name}
              href={ROUTES.menu}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 768px) 33vw, 220px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-base font-bold text-white md:text-lg">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ценности */}
      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {VALUE_PROPS.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl bg-card p-5 ring-1 ring-border/50"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
};
