import SiteLayoutWrapper from '@/app/layout-wrapper';
import WarrantyPage from '@/pages/WarrantyPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Warranty Registration | ExTell Systems',
  description:
    'Register your ExTell Systems product warranty online. Manage warranty coverage for UPS systems, fiber cables, and ICT infrastructure products.',
  alternates: {
    canonical: canonicalUrl('/warranty'),
  },
  openGraph: {
    title: 'Warranty Registration | ExTell Systems',
    description:
      'Register your ExTell Systems UPS or ICT product warranty online. Quick registration, full coverage tracking.',
    url: canonicalUrl('/warranty'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems Warranty Registration' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warranty Registration | ExTell Systems',
    description:
      'Register your ExTell Systems product warranty online for full coverage tracking.',
    images: ['/assets/homebg.jpg'],
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <WarrantyPage />
    </SiteLayoutWrapper>
  );
}
