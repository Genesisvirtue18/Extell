import { Suspense } from 'react';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductsPage from '@/pages/ProductsPage';
import { getProducts } from '@/lib/api';
import { products as siteProducts } from '@/data/siteData';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Products | ExTell Systems',
  description:
    'Browse UPS systems, fiber cables, data center solutions, and ICT infrastructure products from ExTell Systems.',
  alternates: {
    canonical: canonicalUrl('/products'),
  },
};

export default async function Page() {
  let initialProducts = [];
  let initialCategories = [];
  let initialPagination = { total: 0, page: 1, totalPages: 1, limit: 12 };

  try {
    const response = await getProducts({ page: 1, limit: 12 });
    initialProducts = response?.items || [];
    initialCategories = response?.filters?.categories || [];
    initialPagination = response?.pagination || initialPagination;
  } catch {
    initialProducts = siteProducts;
  }

  return (
    <SiteLayoutWrapper>
      <Suspense fallback={<p className="p-8 text-center">Loading products...</p>}>
        <ProductsPage
          initialProducts={initialProducts}
          initialCategories={initialCategories}
          initialPagination={initialPagination}
        />
      </Suspense>
    </SiteLayoutWrapper>
  );
}
