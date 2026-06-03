'use client';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';

export default function Page({ params }) {
  // Inject the slug into context for the component to access
  return (
    <SiteLayoutWrapper>
      <ProductDetailPageContent />
    </SiteLayoutWrapper>
  );
}
