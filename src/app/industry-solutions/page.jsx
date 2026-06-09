import SiteLayoutWrapper from '@/app/layout-wrapper';
import IndustrySolutionsPage from '@/pages/IndustrySolutionsPage';

export const metadata = {
  title: 'Industry Solutions | ExTell Systems',
  description:
    'Explore industry-specific infrastructure solutions designed for telecom, data centers, utilities, and government.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <IndustrySolutionsPage />
    </SiteLayoutWrapper>
  );
}
