'use client';


import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import CategoryPage from '@/pages/CategoryPage';
import { categories } from '@/data/siteData';

export default function Page({ params }) {
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) {
    notFound();
  }

  return (
    <SiteLayoutWrapper>
      <CategoryPage />
    </SiteLayoutWrapper>
  );
}
