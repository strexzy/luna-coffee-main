import type { UserRole } from '@shared/types';

// Единый источник путей. Хардкод строк маршрутов в компонентах запрещён —
// только через ROUTES (упрощает рефакторинг и защищаемо в ВКР).
export const ROUTES = {
  home: '/',
  menu: '/menu',
  product: (id: string): string => `/menu/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  order: (id: string): string => `/order/${id}`,
  profile: '/profile',
  login: '/login',
  register: '/register',
  staff: '/staff',
  staffAccount: '/staff/account',
  admin: '/admin',
  adminAccount: '/admin/account',
} as const;

// Стартовая страница зоны по роли. Используется редиректом после входа
// (Фаза 4) и защитой маршрутов при заходе не в свою зону.
export const getRoleHomePath = (role: UserRole): string => {
  switch (role) {
    case 'staff':
      return ROUTES.staff;
    case 'admin':
      return ROUTES.admin;
    default:
      return ROUTES.home;
  }
};
