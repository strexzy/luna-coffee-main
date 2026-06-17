import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

// Service worker на Serwist — поддерживаемом преемнике next-pwa (тот же автор),
// Workbox под капотом (PWA, Фаза 8). Здесь только декларация воркера; сборку
// (подстановку __SW_MANIFEST и компиляцию в public/sw.js) делает плагин из
// next.config при `next build --webpack`.

// __SW_MANIFEST подставляется сборкой — список прекэшируемых build-ассетов.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // skipWaiting + clientsClaim: новый SW активируется сразу, без ожидания
  // закрытия всех вкладок (ROADMAP, Фаза 8).
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // Готовые стратегии Serwist под ассеты Next (статика, шрифты, изображения).
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        // Offline-страница: отдаётся на навигационные запросы, когда сети нет
        // и ответ не нашёлся в кэше (ТЗ 3.7 «offline-страница»).
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
