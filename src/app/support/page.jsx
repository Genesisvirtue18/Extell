import SiteLayoutWrapper from '@/app/layout-wrapper';
import SupportPage from '@/pages/SupportPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Support Center | ExTell Systems',
  description:
    'Get product support, FAQs, warranty help, downloads, and calculator tools from ExTell Systems.',
  alternates: {
    canonical: canonicalUrl('/support'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <SupportPage />
    </SiteLayoutWrapper>
  );
}
