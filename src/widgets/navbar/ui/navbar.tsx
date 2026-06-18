'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ClipboardList, Coffee, User } from 'lucide-react';
import type { ComponentType } from 'react';

import { LogoutButton } from '@features/auth';
import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { useAuthStore } from '@shared/store';
import { IconCart, IconHome } from '@shared/ui';

import type { NavIconKey, NavItem } from '../model/nav-items';

interface Props {
  items: NavItem[];
}

type IconComponent = ComponentType<{ className?: string; size?: number }>;

// Иконки из набора Figma там, где есть эквивалент (home, cart); lucide — для
// пунктов без него (кофе-меню, профиль, очередь, статистика). Линейный стиль у
// обоих согласован. Маппинг живёт здесь: компоненты-функции нельзя передавать
// через границу server→client, поэтому в nav-items только строковый ключ.
const NAV_ICONS: Record<NavIconKey, IconComponent> = {
  home: IconHome,
  menu: Coffee,
  cart: IconCart,
  profile: User,
  queue: ClipboardList,
  stats: BarChart3,
};

// Адаптивная навигация. Десктоп — верхний хедер, мобильные — нижняя панель.
// Переключение через CSS-утилиты (hidden / md:block), без условного рендера на
// JS — требование ТЗ (п. 4).
export const Navbar = ({ items }: Props) => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Главная активна только при точном совпадении, остальные — по префиксу
  // (чтобы /menu/123 подсвечивал «Меню»).
  const isActive = (href: string): boolean =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Десктоп: липкий хедер с блюром */}
      <header className="sticky top-0 z-40 hidden border-b border-border/60 bg-background/80 backdrop-blur md:block">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Coffee className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Луна Кофе
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
            {user ? <LogoutButton className="ml-1" /> : null}
          </nav>
        </div>
      </header>

      {/* Мобильные: фиксированная нижняя панель с иконками */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {items.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className="group flex flex-1 flex-col items-center gap-0.5 py-2"
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-2xl px-5 py-1 transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground group-active:text-foreground',
                )}
              >
                <Icon className="size-6" size={24} />
              </span>
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
