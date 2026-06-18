import type { User } from '../model/types';

// Три тестовых пользователя — по одному на роль (см. .claude/rules/mocks.md).
// Логины задокументированы в README.
export const MOCK_USERS: User[] = [
  {
    id: 'u-client',
    name: 'Иван Клиентов',
    email: 'client@luna.test',
    role: 'client',
    phone: '79000000001',
  },
  {
    id: 'u-staff',
    name: 'Бариста Луны',
    email: 'barista@luna.test',
    role: 'staff',
  },
  {
    id: 'u-admin',
    name: 'Администратор',
    email: 'admin@luna.test',
    role: 'admin',
  },
];

// Единый тестовый пароль для всех мок-аккаунтов.
export const MOCK_PASSWORD = '12345678';

// Формат мок-токена: бэкенда нет, роль кодируем в самом токене —
// так перехватчик и проверка роли работают как с реальным JWT.
export const makeMockToken = (userId: string): string => `mock-token.${userId}`;

// Достаёт id пользователя из мок-токена (обратная операция к makeMockToken).
export const parseMockToken = (token: string): string | null => {
  const [prefix, userId] = token.split('.');
  return prefix === 'mock-token' && userId ? userId : null;
};
