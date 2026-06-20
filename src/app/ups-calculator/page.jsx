import SiteLayoutWrapper from '@/app/layout-wrapper';
import UpsCalculatorPage from '@/pages/UpsCalculatorPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'UPS Runtime Calculator | ExTell Systems',
  description:
    'Estimate UPS runtime and compare configurations with the ExTell Systems UPS calculator.',
  alternates: {
    canonical: canonicalUrl('/ups-calculator'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <UpsCalculatorPage />
    </SiteLayoutWrapper>
  );
}
