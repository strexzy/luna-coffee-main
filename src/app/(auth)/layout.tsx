import Link from 'next/link';
import { Coffee } from 'lucide-react';
import type { ReactNode } from 'react';

import { ROUTES } from '@shared/config';

// Зона авторизации: без навигации, фирменный логотип над формой по центру.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-secondary/40 p-4">
      <Link href={ROUTES.home} className="flex items-center gap-2">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Coffee className="size-6" />
        </span>
        <span className="text-2xl font-extrabold tracking-tight">Луна Кофе</span>
      </Link>
      {children}
    </div>
  );
}
