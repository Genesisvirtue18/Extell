'use client';

export const dynamic = 'force-dynamic';

import SiteLayoutWrapper from '@/app/layout-wrapper';
import ContactPage from '@/pages/ContactPage';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <ContactPage />
    </SiteLayoutWrapper>
  );
}
