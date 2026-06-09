import SiteLayoutWrapper from '@/app/layout-wrapper';
import UpsCalculatorPage from '@/pages/UpsCalculatorPage';

export const metadata = {
  title: 'UPS Calculator | ExTell Systems',
  description:
    'Estimate UPS runtime and compare configurations with the ExTell Systems calculator.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <UpsCalculatorPage />
    </SiteLayoutWrapper>
  );
}
