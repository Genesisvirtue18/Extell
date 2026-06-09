import SiteLayoutWrapper from '@/app/layout-wrapper';
import CareersPage from '@/pages/CareersPage';

export const metadata = {
  title: 'Careers | ExTell Systems',
  description:
    'Explore career opportunities at ExTell Systems and join a team building enterprise infrastructure solutions.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CareersPage />
    </SiteLayoutWrapper>
  );
}
