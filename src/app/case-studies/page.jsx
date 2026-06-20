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
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <CaseStudiesPage />
    </SiteLayoutWrapper>
  );
}
