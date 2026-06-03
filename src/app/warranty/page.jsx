'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import WarrantyPage from '@/pages/WarrantyPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <WarrantyPage />
    </SiteLayoutWrapper>
  );
}
