import SiteLayoutWrapper from '@/app/layout-wrapper';
import CertificationsPage from '@/pages/CertificationsPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Certifications | ExTell Systems',
  description:
    'Review ExTell Systems certifications and compliance credentials for power and ICT infrastructure products.',
  alternates: {
    canonical: canonicalUrl('/certifications'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CertificationsPage />
    </SiteLayoutWrapper>
  );
}
