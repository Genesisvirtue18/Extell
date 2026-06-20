import SiteLayoutWrapper from '@/app/layout-wrapper';
import WarrantyPage from '@/pages/WarrantyPage';
import { canonicalUrl } from '@/lib/siteUrl';

export const metadata = {
  title: 'Warranty Registration | ExTell Systems',
  description:
    'Register your ExTell product warranty and manage coverage details online.',
  alternates: {
    canonical: canonicalUrl('/warranty'),
  },
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <WarrantyPage />
    </SiteLayoutWrapper>
  );
}
