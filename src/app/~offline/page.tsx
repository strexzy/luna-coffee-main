import { WifiOff } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Нет соединения',
};

// Offline-fallback (PWA, Фаза 8, ТЗ 3.7). Serwist прекэширует эту страницу и
// отдаёт её на навигационные запросы при отсутствии сети. Держим максимально
// простой: без данных, сторов и сетевых вызовов — чтобы гарантированно
// отрисовалась офлайн.
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <WifiOff className="size-9" />
      </span>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Нет соединения</h1>
        <p className="max-w-sm text-muted-foreground">
          Похоже, интернет пропал. Уже открытые страницы остаются доступны, а
          остальное вернётся, как только связь восстановится.
        </p>
      </div>
    </main>
  );
}
