import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@shared/config';
import { Button } from '@shared/ui';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <section className="relative overflow-hidden rounded-2xl">
        <div className="relative h-72 w-full md:h-96">
          <Image
            src="/coffee/hero-bg.jpg"
            alt="Кофе «Луна Кофе»"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 p-6 text-white md:p-10">
            <h1 className="text-3xl font-bold md:text-5xl">Луна Кофе</h1>
            <p className="max-w-md text-white/90">
              Соберите напиток под себя и заберите без очереди.
            </p>
            <Button asChild size="lg" className="mt-2">
              <Link href={ROUTES.menu}>Перейти в меню</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
