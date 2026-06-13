// Публичный API сегмента shared/ui. Снаружи компоненты импортируются
// только отсюда: import { Button, Modal } from '@shared/ui'.

export { Button, buttonVariants } from './button';
export { Badge, badgeVariants } from './badge';
export { Input } from './input';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card';
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
export { Modal } from './modal';
export { Toaster } from './sonner';
export { Skeleton } from './skeleton';
export { Spinner } from './spinner';
export { EmptyState } from './empty-state';
