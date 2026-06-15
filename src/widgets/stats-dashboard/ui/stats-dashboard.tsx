'use client';

import type { DailySales, PopularProduct } from '@entities/order';
import { ExportCsvButton } from '@features/export-csv';
import { formatPrice } from '@shared/lib';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Skeleton,
} from '@shared/ui';

import { useStats } from '../model/use-stats';

export const StatsDashboard = () => {
  const { range, setFrom, setTo, stats, isLoading, error } = useStats();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">Статистика</h1>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">С</span>
            <Input
              type="date"
              value={range.from}
              max={range.to}
              onChange={(e) => setFrom(e.target.value)}
              className="w-auto"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">По</span>
            <Input
              type="date"
              value={range.to}
              min={range.from}
              onChange={(e) => setTo(e.target.value)}
              className="w-auto"
            />
          </label>
          {stats ? (
            <ExportCsvButton
              filename={`luna-sales-${range.from}_${range.to}.csv`}
              headers={['Дата', 'Заказов', 'Выручка']}
              rows={stats.dailySales.map((d) => [d.date, d.orders, d.revenue])}
            />
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <EmptyState title="Ошибка" description={error} />
      ) : !stats || stats.totalOrders === 0 ? (
        <EmptyState
          title="Нет данных за период"
          description="Выберите другой диапазон дат."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Kpi label="Заказов" value={String(stats.totalOrders)} />
            <Kpi label="Выручка" value={formatPrice(stats.totalRevenue)} />
            <Kpi label="Средний чек" value={formatPrice(stats.avgCheck)} />
          </div>

          <SalesChart data={stats.dailySales} />
          <PopularList products={stats.popularProducts} />
        </div>
      )}
    </div>
  );
};

const Kpi = ({ label, value }: { label: string; value: string }) => (
  <Card>
    <CardContent>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

// Продажи по дням — лёгкий столбчатый график на div-ах (без сторонних либ).
const SalesChart = ({ data }: { data: DailySales[] }) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Продажи по дням</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-44 items-end gap-1">
          {data.map((d) => (
            <div
              key={d.date}
              // h-full обязателен: процентная высота бара разрешается
              // относительно высоты столбца, а не auto-контента (flexbox).
              className="flex h-full flex-1 items-end"
              title={`${d.date}: ${formatPrice(d.revenue)}, заказов: ${d.orders}`}
            >
              <div
                className="w-full rounded-t-sm transition-[height]"
                style={{
                  height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%`,
                  backgroundColor: 'var(--chart-1)',
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{data[0]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const PopularList = ({ products }: { products: PopularProduct[] }) => {
  const maxQty = Math.max(...products.map((p) => p.quantity), 1);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Популярные позиции</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((p, i) => (
          <div key={p.productId} className="flex items-center gap-3">
            <span className="w-5 text-center font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate font-medium">{p.name}</span>
                <span className="whitespace-nowrap text-sm text-muted-foreground">
                  {p.quantity} шт · {formatPrice(p.revenue)}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(p.quantity / maxQty) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
    <Skeleton className="h-60 w-full rounded-xl" />
    <Skeleton className="h-48 w-full rounded-xl" />
  </div>
);
