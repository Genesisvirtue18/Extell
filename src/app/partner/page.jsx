import SiteLayoutWrapper from '@/app/layout-wrapper';
import PartnerPage from '@/pages/PartnerPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Partner Program | ExTell Systems',
  description:
    'Learn about the ExTell Systems partner program and collaboration opportunities.',
  alternates: {
    canonical: canonicalUrl('/partner'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <PartnerPage />
    </SiteLayoutWrapper>
  );
}
