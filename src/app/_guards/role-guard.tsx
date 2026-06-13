'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { ROUTES, getRoleHomePath } from '@shared/config';
import { useAuthStore } from '@shared/store';
import type { UserRole } from '@shared/types';
import { Spinner } from '@shared/ui';

interface Props {
  allow: UserRole[];
  children: ReactNode;
}

// Защита маршрутов по роли (ТЗ п. 2, 4). Живёт в слое app — это инициализация
// и маршрутизация, а не доменная фича.
//
// Проверка клиентская: токен хранится в памяти (ТЗ п. 5) и недоступен на
// сервере, поэтому защита работает на уровне рендера. На жёсткой перезагрузке
// сессия сбрасывается → редирект на /login (осознанный компромисс без бэка).
export const RoleGuard = ({ allow, children }: Props) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const allowed = user !== null && allow.includes(user.role);

  useEffect(() => {
    if (!user) {
      router.replace(ROUTES.login);
      return;
    }
    if (!allow.includes(user.role)) {
      // Зашёл не в свою зону — отправляем на стартовую страницу его роли.
      router.replace(getRoleHomePath(user.role));
    }
  }, [user, allow, router]);

  // Пока решается редирект — не показываем защищённый контент.
  if (!allowed) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Spinner className="size-6" />
      </div>
    );
  }

  return <>{children}</>;
};
