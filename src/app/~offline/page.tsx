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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-6xl" aria-hidden>
        ☕️
      </span>
      <h1 className="text-2xl font-bold">Нет соединения</h1>
      <p className="max-w-sm text-muted-foreground">
        Похоже, интернет пропал. Уже открытые страницы остаются доступны, а
        остальное вернётся, как только связь восстановится.
      </p>
    </main>
  );
}
