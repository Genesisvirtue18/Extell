import SiteLayoutWrapper from '@/app/layout-wrapper';
import PartnerPage from '@/pages/PartnerPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Partners | ExTell Systems',
  description: 'Browse ExTell Systems partners, their locations, contact details, and assigned products.',
  alternates: {
    canonical: canonicalUrl('/partner'),
  },
  openGraph: {
    title: 'Partners | ExTell Systems',
    description: 'Browse ExTell Systems partners, their locations, contact details, and assigned products.',
    url: canonicalUrl('/partner'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems Partners' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Partners | ExTell Systems',
    description: 'Browse ExTell Systems partners, their locations, contact details, and assigned products.',
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
