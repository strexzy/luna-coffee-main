import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

// Serwist — поддерживаемый преемник next-pwa (тот же автор), Workbox под капотом.
// Подключаем ТОЛЬКО для production-сборки (`next build --webpack`). Причина: в dev
// Next 16 работает на Turbopack, а Serwist добавляет в конфиг webpack-хук (даже с
// disable). «Webpack-конфиг без turbopack-конфига под Turbopack» Next 16 считает
// ошибкой — `next dev` падает. SW в dev и не нужен, поэтому там отдаём чистый конфиг.
function withPwa(config: NextConfig): NextConfig {
  // Ревизия версионирует прекэш offline-страницы: хеш коммита (или случайный uuid
  // вне git) — старый офлайн-ответ не «залипает» в кэше после деплоя.
  const revision =
    spawnSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf-8',
    }).stdout?.trim() || randomUUID();

  return withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
    register: false, // регистрируем SW сами (_components/service-worker)
    // Прекэш offline-страницы — fallback работает без сети с первого визита.
    additionalPrecacheEntries: [{ url: '/~offline', revision }],
  })(config);
}

export default process.env.NODE_ENV === 'development'
  ? nextConfig
  : withPwa(nextConfig);
