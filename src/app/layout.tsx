import type { Metadata, Viewport } from 'next';
import { Manrope, Geist_Mono } from 'next/font/google';

import { Toaster } from '@shared/ui';

import { ServiceWorkerRegister } from './_components/service-worker';
import './globals.css';

// Manrope — геометричный гротеск с полной поддержкой кириллицы и широким
// диапазоном начертаний (под жирные заголовки макета). Variable-шрифт: грузим
// весь диапазон весов. Латиница + кириллица для русского интерфейса.
const fontSans = Manrope({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: 'Луна Кофе',
  title: {
    default: 'Луна Кофе',
    template: '%s · Луна Кофе',
  },
  description: 'PWA-приложение кофейни «Луна Кофе»: меню, заказы, статус.',
  // Манифест Next отдаёт по этому пути (см. app/manifest.ts).
  manifest: '/manifest.webmanifest',
  // Поведение как у нативного приложения при установке на iOS.
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Луна Кофе',
  },
  // Иконки — импортированные ассеты в public/. favicon.ico браузеры берут с
  // корня и без объявления, но указываем явно — один источник истины.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  // Чтобы Safari не превращал номера заказов в «телефонные» ссылки.
  formatDetection: { telephone: false },
};

// Цвет системной строки в установленном PWA — фирменный зелёный (как theme_color
// манифеста). themeColor живёт в viewport (требование Next 16).
export const viewport: Viewport = {
  themeColor: '#007142',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${fontSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Регистрация service worker (PWA) — клиентский компонент, без UI. */}
        <ServiceWorkerRegister />
        {children}
        {/* Глобальные тосты: один Toaster на всё приложение. */}
        <Toaster />
      </body>
    </html>
  );
}
