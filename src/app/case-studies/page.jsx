'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import CaseStudiesPage from '@/pages/CaseStudiesPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CaseStudiesPage />
    </SiteLayoutWrapper>
  );
}
