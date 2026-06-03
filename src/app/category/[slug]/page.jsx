'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import CategoryPage from '@/pages/CategoryPage';

export default function Page({ params }) {
  return (
    <SiteLayoutWrapper>
      <CategoryPage />
    </SiteLayoutWrapper>
  );
}
