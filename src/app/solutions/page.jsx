'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import SolutionsPage from '@/pages/SolutionsPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <SolutionsPage />
    </SiteLayoutWrapper>
  );
}
