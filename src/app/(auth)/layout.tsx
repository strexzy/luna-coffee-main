import type { ReactNode } from 'react';

// Зона авторизации: без навигации, форма по центру экрана.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      {children}
    </div>
  );
}
