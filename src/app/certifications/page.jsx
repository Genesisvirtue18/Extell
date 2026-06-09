import SiteLayoutWrapper from '@/app/layout-wrapper';
import CertificationsPage from '@/pages/CertificationsPage';

export const metadata = {
  title: 'Certifications | ExTell Systems',
  description:
    'Review ExTell Systems certifications and compliance credentials for power and ICT infrastructure products.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CertificationsPage />
    </SiteLayoutWrapper>
  );
}
