'use client';

import Link from 'next/link';

import { OrderCard } from '@entities/order';
import { USER_ROLE_LABELS } from '@entities/user';
import { LogoutButton } from '@features/auth';
import { EditProfileForm } from '@features/edit-profile';
import { ROUTES } from '@shared/config';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
} from '@shared/ui';

import { useProfile } from '../model/use-profile';

interface Props {
  // Клиент: редактирование профиля + история заказов. Бариста/админ: только
  // данные аккаунта и выход (история заказов для них нерелевантна — решение
  // зафиксировано с пользователем).
  editable?: boolean;
  showOrders?: boolean;
}

export const Profile = ({ editable = false, showOrders = false }: Props) => {
  const { user, orders, isLoading, error, unauthorized, setUser } =
    useProfile(showOrders);

  const title = showOrders ? 'Личный кабинет' : 'Аккаунт';

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {user ? <LogoutButton /> : null}
      </div>

      {isLoading ? (
        <ProfileSkeleton />
      ) : unauthorized ? (
        <EmptyState
          title="Вы не вошли"
          description="Войдите в аккаунт, чтобы видеть профиль и историю заказов."
          action={
            <Button asChild>
              <Link href={ROUTES.login}>Войти</Link>
            </Button>
          }
        />
      ) : error || !user ? (
        <EmptyState title="Ошибка" description={error ?? 'Профиль недоступен'} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="truncate">{user.name}</span>
                <Badge variant="secondary">{USER_ROLE_LABELS[user.role]}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>{user.email}</p>
              <p>{user.phone ? user.phone : 'Телефон не указан'}</p>
            </CardContent>
          </Card>

          {editable ? (
            <Card>
              <CardHeader>
                <CardTitle>Редактировать профиль</CardTitle>
              </CardHeader>
              <CardContent>
                <EditProfileForm user={user} onSaved={setUser} />
              </CardContent>
            </Card>
          ) : null}

          {showOrders ? (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">История заказов</h2>
              {orders.length === 0 ? (
                <EmptyState
                  title="Заказов пока нет"
                  description="Оформите первый заказ в меню — он появится здесь."
                />
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={ROUTES.order(order.id)}
                      className="block"
                    >
                      <OrderCard order={order} />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          ) : null}
        </>
      )}
    </main>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-28 w-full rounded-xl" />
    <Skeleton className="h-40 w-full rounded-xl" />
  </div>
);
