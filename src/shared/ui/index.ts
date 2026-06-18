// Публичный API сегмента shared/ui. Снаружи компоненты импортируются
// только отсюда: import { Button, Modal } from '@shared/ui'.

export { Button, buttonVariants } from './button';
export { Badge, badgeVariants } from './badge';
export { Input } from './input';
export { Textarea } from './textarea';
export { Label } from './label';
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
// Императивный вызов тостов — через единую точку UI, не из 'sonner' напрямую.
export { toast } from 'sonner';
export { Skeleton } from './skeleton';
export { Spinner } from './spinner';
export { Slider } from './slider';
export { Switch } from './switch';
export { EmptyState } from './empty-state';
// Точечные анимации появления (Motion / React Bits).
export { Reveal } from './reveal';
// Иконки интерфейса из макета Figma (currentColor → темизируются классами).
export * from './icons';
