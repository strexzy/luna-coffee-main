'use client';

import { useEffect } from 'react';

// Управление service worker (PWA, Фаза 8). Явный клиентский компонент в слое
// app — как требует ROADMAP. В next.config стоит register:false, поэтому
// регистрируем/снимаем сами, не завязываясь на window.serwist.
export const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV === 'production') {
      void navigator.serviceWorker.register('/sw.js').catch(() => {
        // Недоступность SW не должна влиять на работу UI — молча игнорируем.
      });
      return;
    }

    // В dev (Turbopack) SW не нужен. Активно снимаем любой ранее
    // зарегистрированный воркер (например, от прод-сборки на том же localhost) и
    // чистим его кэши: иначе он отдаёт устаревшие чанки и ломает клиентскую
    // навигацию ошибкой «module factory is not available». Самолечение dev.
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => void reg.unregister());
    });
    if ('caches' in window) {
      void caches
        .keys()
        .then((keys) => keys.forEach((key) => void caches.delete(key)));
    }
  }, []);

  return null;
};
