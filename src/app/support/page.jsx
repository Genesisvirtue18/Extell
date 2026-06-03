'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import SupportPage from '@/pages/SupportPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <SupportPage />
    </SiteLayoutWrapper>
  );
}
