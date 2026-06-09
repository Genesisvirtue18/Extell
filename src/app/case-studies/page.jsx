import SiteLayoutWrapper from '@/app/layout-wrapper';
import CaseStudiesPage from '@/pages/CaseStudiesPage';

export const metadata = {
  title: 'Case Studies | ExTell Systems',
  description:
    'Read selected case studies and project stories from ExTell Systems across data centers, telecom, and industry.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CaseStudiesPage />
    </SiteLayoutWrapper>
  );
}
