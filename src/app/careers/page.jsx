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
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CareersPage />
    </SiteLayoutWrapper>
  );
}
