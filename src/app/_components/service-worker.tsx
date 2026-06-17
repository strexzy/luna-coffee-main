'use client';

import { useEffect } from 'react';

// Регистрация service worker (PWA, Фаза 8). Вынесена в явный клиентский
// компонент в слое app — как требует ROADMAP («регистрация SW клиентским
// компонентом в корневом layout»). В next.config стоит register:false, поэтому
// регистрируем сами, не завязываясь на window.serwist.
//
// Только в production: в dev сборка идёт через Turbopack, Serwist отключён
// (disable), и файла /sw.js нет — регистрация там лишь сыпала бы 404.
export const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // Недоступность SW не должна влиять на работу UI — молча игнорируем.
    });
  }, []);

  return null;
};
