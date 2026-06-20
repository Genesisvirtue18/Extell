import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import CategoryPage from '@/pages/CategoryPage';
import { categories } from '@/data/siteData';
import { canonicalUrl } from '@/lib/siteUrl';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return { title: 'Category Not Found | ExTell Systems' };
  }

  const url = canonicalUrl(`/category/${slug}`);

  return {
    title: `${category.name} | ExTell Systems`,
    description: `Browse ExTell Systems ${category.name} — enterprise-grade power electronics and ICT infrastructure products.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${category.name} | ExTell Systems`,
      description: `Browse ExTell Systems ${category.name} — enterprise-grade power electronics and ICT infrastructure products.`,
      url,
      siteName: 'ExTell Systems',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

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
