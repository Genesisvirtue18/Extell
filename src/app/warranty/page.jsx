import SiteLayoutWrapper from '@/app/layout-wrapper';
import WarrantyPage from '@/pages/WarrantyPage';

export const metadata = {
  title: 'Warranty Registration | ExTell Systems',
  description:
    'Register your ExTell product warranty and manage coverage details online.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <WarrantyPage />
    </SiteLayoutWrapper>
  );
}
