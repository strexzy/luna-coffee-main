'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ClipboardList,
  Coffee,
  Home,
  ShoppingBag,
  User,
  type LucideIcon,
} from 'lucide-react';

import { LogoutButton } from '@features/auth';
import { ROUTES } from '@shared/config';
import { cn } from '@shared/lib';
import { useAuthStore } from '@shared/store';

import type { NavIconKey, NavItem } from '../model/nav-items';

interface Props {
  items: NavItem[];
}

// Сопоставление ключа иконки с lucide-компонентом. Здесь, в клиентском
// компоненте, потому что компоненты-функции нельзя передавать через границу
// server → client (см. nav-items.ts).
const NAV_ICONS: Record<NavIconKey, LucideIcon> = {
  home: Home,
  menu: Coffee,
  cart: ShoppingBag,
  profile: User,
  queue: ClipboardList,
  stats: BarChart3,
};

// Адаптивная навигация. Десктоп — верхний хедер, мобильные — нижняя панель.
// Переключение через CSS-утилиты (hidden / md:flex), без условного рендера
// на JS — требование ТЗ (п. 4).
export const Navbar = ({ items }: Props) => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Главная активна только при точном совпадении, остальные — по префиксу
  // (чтобы /menu/123 подсвечивал «Меню»).
  const isActive = (href: string): boolean =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Десктоп: верхний хедер с горизонтальной навигацией */}
      <header className="sticky top-0 z-40 hidden border-b bg-background md:block">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <Link href={ROUTES.home} className="text-lg font-bold">
            Луна Кофе
          </Link>
          <nav className="flex items-center gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Кнопка выхода видна только при активной сессии. */}
            {user ? <LogoutButton /> : null}
          </nav>
        </div>
      </header>

      {/* Мобильные: фиксированная нижняя панель */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background md:hidden">
        {items.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};
