'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import UpsCalculatorPage from '@/pages/UpsCalculatorPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <UpsCalculatorPage />
    </SiteLayoutWrapper>
  );
}
