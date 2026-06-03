'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import CertificationsPage from '@/pages/CertificationsPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CertificationsPage />
    </SiteLayoutWrapper>
  );
}
