import { notFound } from 'next/navigation';

import { getProductById, type Product } from '@entities/product';
import { ApiError } from '@shared/api';
import { DrinkConfigurator } from '@widgets/drink-configurator';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product;
  try {
    product = await getProductById(id);
  } catch (e) {
    // Несуществующий товар → штатная страница 404 Next.js.
    if (e instanceof ApiError && e.status === 404) {
      notFound();
    }
    throw e;
  }

  return <DrinkConfigurator product={product} />;
}
