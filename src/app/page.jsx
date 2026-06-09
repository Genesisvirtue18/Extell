import SiteLayoutWrapper from './layout-wrapper';
import HomeHero from '@/components/sections/HomeHero';
import CategoryGridSection from '@/components/sections/CategoryGridSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import SolutionsShowcaseSection from '@/components/sections/SolutionsShowcaseSection';

export const metadata = {
  title: 'ExTell Systems | UPS, Power Backup & ICT Infrastructure',
  description:
    'ExTell Systems provides UPS, power backup, structured cabling, and ICT infrastructure solutions for enterprise customers.',
};

export default function HomePage() {
  return (
    <SiteLayoutWrapper>
      <HomeHero />
      <CategoryGridSection />
      <FeaturedProductsSection />
      <SolutionsShowcaseSection />
     
    </SiteLayoutWrapper>
  );
}
