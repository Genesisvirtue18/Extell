'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import PartnerPage from '@/pages/PartnerPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <PartnerPage />
    </SiteLayoutWrapper>
  );
}
