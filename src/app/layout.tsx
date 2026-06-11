import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Toaster } from '@shared/ui';

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
  title: 'Луна Кофе',
  description: 'PWA-приложение кофейни «Луна Кофе»: меню, заказы, статус.',
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
        {children}
        {/* Глобальные тосты: один Toaster на всё приложение. */}
        <Toaster />
      </body>
    </html>
  );
}
