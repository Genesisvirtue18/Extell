import SiteLayoutWrapper from '@/app/layout-wrapper';
import AboutPage from '@/pages/AboutPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'About ExTell Systems',
  description:
    'Learn about ExTell Systems, our mission, and our enterprise infrastructure capabilities.',
  alternates: {
    canonical: canonicalUrl('/about'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <AboutPage />
    </SiteLayoutWrapper>
  );
}
