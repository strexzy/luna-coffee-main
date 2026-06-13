'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@shared/ui';

import { useLogout } from '../model/use-logout';

interface Props {
  className?: string;
}

export const LogoutButton = ({ className }: Props) => {
  const logout = useLogout();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => logout()}
      className={className}
    >
      <LogOut className="size-4" />
      Выйти
    </Button>
  );
};
