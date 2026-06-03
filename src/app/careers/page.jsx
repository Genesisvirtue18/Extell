'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import CareersPage from '@/pages/CareersPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CareersPage />
    </SiteLayoutWrapper>
  );
}
