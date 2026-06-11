// Базовые контрактные типы пользователя. Живут в shared, а не в entities,
// потому что нужны инфраструктуре shared (стор авторизации, перехватчики).
// Слой entities расширит их доменными типами (фаза 2) — импорт entities → shared
// разрешён правилом слоёв, обратный — нет.

export type UserRole = 'client' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
