import { Profile } from '@widgets/profile';

// Личный кабинет клиента (ТЗ §3.4): профиль, редактирование, история заказов,
// выход. Для гостя виджет покажет приглашение войти.
export default function ProfilePage() {
  return <Profile editable showOrders />;
}
