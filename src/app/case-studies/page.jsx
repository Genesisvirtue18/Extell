import SiteLayoutWrapper from '@/app/layout-wrapper';
import CaseStudiesPage from '@/pages/CaseStudiesPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Case Studies | ExTell Systems',
  description:
    'Read selected case studies and project stories from ExTell Systems across data centers, telecom, and industry.',
  alternates: {
    canonical: canonicalUrl('/case-studies'),
  },
  openGraph: {
    title: 'Case Studies | ExTell Systems',
    description:
      'Real-world deployments of ExTell Systems UPS and ICT infrastructure across data centers, telecom, banking, and industrial sectors.',
    url: canonicalUrl('/case-studies'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'ExTell Systems Case Studies' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies | ExTell Systems',
    description:
      'Real-world deployments of ExTell Systems UPS and ICT infrastructure across data centers, telecom, and industry.',
    images: ['/assets/homebg.jpg'],
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CaseStudiesPage />
    </SiteLayoutWrapper>
  );
}
