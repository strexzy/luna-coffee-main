import { CURRENCY, LOCALE } from '@shared/config';

// Цены в кофейне целые, поэтому копейки не показываем.
const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

// 250 → «250 ₽»
export const formatPrice = (value: number): string =>
  priceFormatter.format(value);
