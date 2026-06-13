import type { ReactNode } from 'react';

import { Navbar, STAFF_NAV } from '@widgets/navbar';

import { RoleGuard } from '../_guards/role-guard';

// Зона бариста: только роль staff.
export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allow={['staff']}>
      <div className="flex min-h-full flex-col">
        <Navbar items={STAFF_NAV} />
        <div className="flex flex-1 flex-col pb-16 md:pb-0">{children}</div>
      </div>
    </RoleGuard>
  );
}
