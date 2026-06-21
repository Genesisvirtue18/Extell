import SiteLayoutWrapper from '@/app/layout-wrapper';
import DownloadsPage from '@/pages/DownloadsPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Downloads — Datasheets & Brochures | ExTell Systems',
  description:
    'Download product datasheets, technical brochures, firmware, and installation guides for ExTell Systems UPS, fiber, and ICT infrastructure products.',
  alternates: {
    canonical: canonicalUrl('/downloads'),
  },
  openGraph: {
    title: 'Downloads — Datasheets & Brochures | ExTell Systems',
    description:
      'Product datasheets, firmware, and technical guides for ExTell Systems UPS, fiber, and ICT infrastructure.',
    url: canonicalUrl('/downloads'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems Downloads' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Downloads — Datasheets & Brochures | ExTell Systems',
    description:
      'Product datasheets, firmware, and technical guides for ExTell Systems UPS and ICT infrastructure.',
    images: ['/assets/homebg.jpg'],
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <DownloadsPage />
    </SiteLayoutWrapper>
  );
}
