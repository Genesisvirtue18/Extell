'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductsPage from '@/pages/ProductsPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <ProductsPage />
    </SiteLayoutWrapper>
  );
}
