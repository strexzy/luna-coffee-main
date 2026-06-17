import type { MetadataRoute } from 'next';

// Web App Manifest (PWA, Фаза 8). Next отдаёт его по /manifest.webmanifest.
// Иконки — импортированные ассеты в public/. Цвета — из фирменной темы
// (зелёный OKLCH из globals.css, переведён в hex: манифест требует обычный
// CSS-цвет, oklch() поддержан не везде). 192/512 даём и как `any`, и как
// `maskable` — адаптивные иконки Android и обычный fallback одновременно.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Луна Кофе',
    short_name: 'Луна Кофе',
    description:
      'Кофейня «Луна Кофе»: меню, конструктор напитка, заказы и их статус в реальном времени.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fafdfa',
    theme_color: '#007142',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
