import SiteLayoutWrapper from '@/app/layout-wrapper';
import CareersPage from '@/pages/CareersPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Careers | ExTell Systems',
  description:
    'Explore career opportunities at ExTell Systems and join a team building enterprise infrastructure solutions.',
  alternates: {
    canonical: canonicalUrl('/careers'),
  },
  openGraph: {
    title: 'Careers at ExTell Systems | Join Our Team',
    description:
      'Join ExTell Systems and help build enterprise UPS, power, and ICT infrastructure solutions for customers across 20+ countries.',
    url: canonicalUrl('/careers'),
    siteName: 'ExTell Systems',
    type: 'website',
    images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: 'Careers at ExTell Systems' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at ExTell Systems | Join Our Team',
    description:
      'Join ExTell Systems and help build enterprise infrastructure solutions for customers across 20+ countries.',
    images: ['/assets/homebg.jpg'],
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CareersPage />
    </SiteLayoutWrapper>
  );
}
