import SiteLayoutWrapper from '@/app/layout-wrapper';
import PartnerPage from '@/pages/PartnerPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Partner Program | ExTell Systems',
  description:
    'Learn about the ExTell Systems partner program and collaboration opportunities for resellers, integrators, and distributors.',
  alternates: {
    canonical: canonicalUrl('/partner'),
  },
  openGraph: {
    title: 'Partner Program | ExTell Systems',
    description:
      'Become an ExTell Systems partner — reseller, integrator, or distributor of enterprise UPS and ICT infrastructure solutions.',
    url: canonicalUrl('/partner'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems Partner Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partner Program | ExTell Systems',
    description:
      'Become an ExTell Systems partner — reseller, integrator, or distributor of enterprise infrastructure solutions.',
    images: ['/assets/homebg.jpg'],
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <PartnerPage />
    </SiteLayoutWrapper>
  );
}
