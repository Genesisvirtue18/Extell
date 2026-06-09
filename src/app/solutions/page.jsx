import SiteLayoutWrapper from '@/app/layout-wrapper';
import SolutionsPage from '@/pages/SolutionsPage';

export const metadata = {
  title: 'Solutions | ExTell Systems',
  description:
    'Explore ExTell Systems solutions for modular UPS, industrial power, structured cabling, and solar infrastructure.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <SolutionsPage />
    </SiteLayoutWrapper>
  );
}
