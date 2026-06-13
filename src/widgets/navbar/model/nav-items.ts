import { ROUTES } from '@shared/config';

// Ключ иконки, а не сам компонент: конфиг сериализуем и передаётся из
// серверного layout в клиентский Navbar без ошибки сериализации.
// Сопоставление ключ → lucide-иконка живёт в ui/navbar.tsx.
export type NavIconKey =
  | 'home'
  | 'menu'
  | 'cart'
  | 'profile'
  | 'queue'
  | 'stats';

export interface NavItem {
  href: string;
  label: string;
  icon: NavIconKey;
}

// Навигация клиентской зоны (нижняя панель на мобильных, хедер на десктопе).
export const CLIENT_NAV: NavItem[] = [
  { href: ROUTES.home, label: 'Главная', icon: 'home' },
  { href: ROUTES.menu, label: 'Меню', icon: 'menu' },
  { href: ROUTES.cart, label: 'Корзина', icon: 'cart' },
  { href: ROUTES.profile, label: 'Профиль', icon: 'profile' },
];

export const STAFF_NAV: NavItem[] = [
  { href: ROUTES.staff, label: 'Очередь', icon: 'queue' },
];

export const ADMIN_NAV: NavItem[] = [
  { href: ROUTES.admin, label: 'Статистика', icon: 'stats' },
];
