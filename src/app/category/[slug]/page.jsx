import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import CategoryPage from '@/pages/CategoryPage';
import { categories } from '@/data/siteData';

export default async function Page({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }

  return (
    <SiteLayoutWrapper>
      <CategoryPage slug={slug} />
    </SiteLayoutWrapper>
  );
}
