import Link from 'next/link';
import { Coffee, MapPin, Phone } from 'lucide-react';

import { ROUTES } from '@shared/config';

import { OpenStatus } from './open-status';

const HOURS: [string, string][] = [
  ['Пн', '08:00 – 20:00'],
  ['Вт', '08:00 – 20:00'],
  ['Ср', '08:00 – 20:00'],
  ['Чт', '08:00 – 20:00'],
  ['Пт', '08:00 – 20:00'],
  ['Сб', '10:00 – 20:00'],
  ['Вс', '10:00 – 20:00'],
];

const PHONES = ['+7 (922) 033-26-48', '+7 (982) 603-96-20'];

// Подвал с контактами, часами работы, реквизитами ИП и навигацией.
export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Бренд */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Coffee className="size-5" />
              </span>
              <span className="text-lg font-extrabold">Луна Кофе</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Соберите идеальный напиток под себя и заберите без очереди.
            </p>
            <a
              href="https://vk.com/luna.coffee"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Сообщество ВКонтакте →
            </a>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="font-bold">Контакты</h3>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              ул. Свердлова, 56, Кировград
            </p>
            {PHONES.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="size-4 shrink-0" />
                {phone}
              </a>
            ))}
          </div>

          {/* Часы работы */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">Часы работы</h3>
              <OpenStatus />
            </div>
            <dl className="mt-3 space-y-1 text-sm text-muted-foreground">
              {HOURS.map(([day, hours]) => (
                <div key={day} className="flex justify-between gap-4">
                  <dt>{day}</dt>
                  <dd className="tabular-nums">{hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="font-bold">Разделы</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={ROUTES.menu} className="hover:text-foreground">
                  Меню
                </Link>
              </li>
              <li>
                <Link href={ROUTES.cart} className="hover:text-foreground">
                  Корзина
                </Link>
              </li>
              <li>
                <Link href={ROUTES.profile} className="hover:text-foreground">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Реквизиты + копирайт */}
        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <p>
            ИП Родин Иван Дмитриевич · ОГРНИП 322665800146571 · ИНН
            668200659819
          </p>
          <p className="mt-2">
            © {year} «Луна Кофе». Самовывоз. Цены и наличие уточняйте при
            заказе.
          </p>
        </div>
      </div>
    </footer>
  );
};
