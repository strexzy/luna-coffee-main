import { Plus } from 'lucide-react';

import { getProducts, ProductCard } from '@entities/product';
import { getOrders, OrderCard } from '@entities/order';
import { Button } from '@shared/ui';

// ВРЕМЕННАЯ демо-страница Фазы 2: проверяет, что сущности рендерятся
// на мок-данных. В Фазе 3 заменяется реальной главной + маршрутами,
// каталог переедет в widgets/menu-catalog.
export default async function Home() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Луна Кофе — каталог (демо)</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            // Кнопка-заглушка: фича add-to-cart внедрит сюда обработчик в Фазе 5.
            action={
              <Button
                size="icon"
                className="size-8 rounded-full"
                aria-label="В корзину"
              >
                <Plus className="size-4" />
              </Button>
            }
          />
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold">Заказы (демо)</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </main>
  );
}
