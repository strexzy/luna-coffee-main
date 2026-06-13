import type { ReactNode } from 'react';

import { ADMIN_NAV, Navbar } from '@widgets/navbar';

import { RoleGuard } from '../_guards/role-guard';

// Админ-зона: только роль admin.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allow={['admin']}>
      <div className="flex min-h-full flex-col">
        <Navbar items={ADMIN_NAV} />
        <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
      </div>
    </RoleGuard>
  );
}
