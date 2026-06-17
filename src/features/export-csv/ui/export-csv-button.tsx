'use client';

import { Download } from 'lucide-react';

import { Button } from '@shared/ui';

import { toCsv } from '../lib/to-csv';

interface Props {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
  className?: string;
}

// Клиентский экспорт в CSV (ТЗ 3.6, без сервера): собираем строку, формируем
// Blob и инициируем скачивание через временную ссылку.
export const ExportCsvButton = ({
  filename,
  headers,
  rows,
  className,
}: Props) => {
  const handleExport = () => {
    const csv = toCsv(headers, rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    // Ссылку нужно поместить в документ до click(): часть браузеров
    // (Firefox, отдельные мобильные) не запускают скачивание для отсоединённого
    // элемента (ревью [Фаза 8]). После — убираем и освобождаем objectURL.
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleExport}
      disabled={rows.length === 0}
      className={className}
    >
      <Download className="size-4" />
      Экспорт CSV
    </Button>
  );
};
