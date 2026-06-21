import SiteLayoutWrapper from '@/app/layout-wrapper';
import UpsCalculatorPage from '@/pages/UpsCalculatorPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'UPS Calculator | ExTell Systems',
  description:
    'Estimate UPS runtime and compare configurations with the ExTell Systems calculator.',
  alternates: {
    canonical: canonicalUrl('/ups-calculator'),
  },
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <UpsCalculatorPage />
    </SiteLayoutWrapper>
  );
}
