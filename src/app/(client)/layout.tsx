import type { ReactNode } from 'react';

import { Footer } from '@widgets/footer';
import { CLIENT_NAV, Navbar } from '@widgets/navbar';

// Клиентская зона открыта гостю (просмотр меню без входа — ТЗ п. 2).
// pb-16 на мобильных — отступ под фиксированную нижнюю панель навигации.
export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar items={CLIENT_NAV} />
      <div className="flex flex-1 flex-col pb-16 md:pb-0">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
