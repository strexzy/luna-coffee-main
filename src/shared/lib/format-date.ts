import { LOCALE } from '@shared/config';

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
});

// «12 июня, 14:30» — для истории заказов и админки.
export const formatDate = (date: Date | string): string =>
  dateTimeFormatter.format(typeof date === 'string' ? new Date(date) : date);

// «14:30» — для времени получения заказа.
export const formatTime = (date: Date | string): string =>
  timeFormatter.format(typeof date === 'string' ? new Date(date) : date);
