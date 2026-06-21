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
  openGraph: {
    title: 'Certifications & Compliance | ExTell Systems',
    description:
      'ExTell Systems certifications and compliance credentials for UPS, power electronics, and ICT infrastructure products.',
    url: canonicalUrl('/certifications'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems Certifications' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certifications & Compliance | ExTell Systems',
    description:
      'Certifications and compliance credentials for ExTell Systems power electronics and ICT infrastructure products.',
    images: ['/assets/homebg.jpg'],
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CertificationsPage />
    </SiteLayoutWrapper>
  );
}
