// Сериализация таблицы в CSV. Разделитель «;» — как ожидает Excel в RU-локали;
// значения с разделителями/кавычками/переводом строки оборачиваются в кавычки,
// внутренние кавычки удваиваются. Одиночный \r (без \n) тоже экранируем —
// иначе он разорвёт строку CSV (ревью [Фаза 8]).
const escapeCell = (value: string | number): string => {
  const text = String(value);
  if (/["\n\r;,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

export const toCsv = (
  headers: string[],
  rows: (string | number)[][],
): string => {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(';'));
  // BOM в начале — чтобы Excel корректно открыл кириллицу в UTF-8.
  return `﻿${lines.join('\r\n')}`;
};
