import SiteLayoutWrapper from '@/app/layout-wrapper';
import SupportPage from '@/pages/SupportPage';

export const metadata = {
  title: 'Support Center | ExTell Systems',
  description:
    'Get product support, FAQs, warranty help, downloads, and calculator tools from ExTell Systems.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <SupportPage />
    </SiteLayoutWrapper>
  );
}
