'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import DownloadsPage from '@/pages/DownloadsPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <DownloadsPage />
    </SiteLayoutWrapper>
  );
}
