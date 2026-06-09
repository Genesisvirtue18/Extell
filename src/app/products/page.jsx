import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductsPage from '@/pages/ProductsPage';

export const metadata = {
  title: 'Products | ExTell Systems',
  description:
    'Browse ExTell Systems products for UPS, power backup, structured cabling, and ICT infrastructure.',
};

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <ProductsPage />
    </SiteLayoutWrapper>
  );
}
