import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from '@shared/ui';

import { ServiceWorkerRegister } from './_components/service-worker';
import './globals.css';

// Geist поддерживает кириллицу через подмножество latin-ext не полностью,
// но next/font загружает нужные глифы автоматически; при проблемах с
// кириллицей шрифт пересмотрим в фазе 9 (полировка).
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
