import SiteLayoutWrapper from '@/app/layout-wrapper';
import PartnerPage from '@/pages/PartnerPage';

export const metadata = {
  title: 'Partner Program | ExTell Systems',
  description:
    'Learn about the ExTell Systems partner program and collaboration opportunities.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <PartnerPage />
    </SiteLayoutWrapper>
  );
}
