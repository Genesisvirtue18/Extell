'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import AboutPage from '@/pages/AboutPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <AboutPage />
    </SiteLayoutWrapper>
  );
}
