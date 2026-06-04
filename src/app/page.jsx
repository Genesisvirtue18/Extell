'use client';


import SiteLayoutWrapper from './layout-wrapper';
import HomeHero from '@/components/sections/HomeHero';
import CategoryGridSection from '@/components/sections/CategoryGridSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import SolutionsShowcaseSection from '@/components/sections/SolutionsShowcaseSection';


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
