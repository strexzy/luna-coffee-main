'use client';

import type { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

// Обёртка над Shadcn Dialog для типового случая «управляемая модалка
// с заголовком». Для нестандартных сценариев примитивы Dialog* тоже
// доступны из публичного API.

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  // Подзаголовок нужен и для доступности: Radix предупреждает,
  // если у диалога нет описания.
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
};
