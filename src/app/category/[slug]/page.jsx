import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import CategoryPage from '@/pages/CategoryPage';
import { categories } from '@/data/siteData';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildCategoryFAQSchema,
  WEBSITE_ID,
} from '@/lib/schemas';
import { SEO_KEYWORD_GROUPS } from '@/lib/seoKeywords';

const limitText = (value, maxLength) => {
  const text = String(value || '').trim();
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    return { title: 'Category Not Found | ExTell Systems' };
  }

  const url = canonicalUrl(`/category/${slug}`);

  return {
    title: { absolute: limitText(`${category.name} Products | ExTell Systems`, 60) },
    description: limitText(`Explore ${category.name} products from ExTell Systems for data center, telecom, and industrial applications. Browse specifications and request a quote.`, 160),
    keywords: [
      category.name,
      ...(slug.includes('fiber') || slug.includes('network')
        ? SEO_KEYWORD_GROUPS.structuredCabling
        : SEO_KEYWORD_GROUPS.ups),
      'enterprise',
      'ICT infrastructure',
      'power electronics',
      'ExTell Systems',
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} | ExTell Systems`,
      description: `Enterprise ${category.name} from ExTell Systems for data centers, telecom, and industrial environments.`,
      url,
      siteName: 'ExTell Systems',
      type: 'website',
      images: [{ url: '/assets/homebg.jpg', width: 1200, height: 630, alt: `${category.name} — ExTell Systems` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ExTell Systems`,
      description: `Enterprise ${category.name} from ExTell Systems for data centers, telecom, and industrial environments.`,
      images: ['/assets/homebg.jpg'],
    },
  };
}

// ISR: revalidate every hour — prevents 5xx when Render backend is sleeping
export const revalidate = 3600;

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const url = canonicalUrl(`/category/${slug}`);

  // AEO: breadcrumb rich result
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: canonicalUrl('/') },
    { name: 'Products', url: canonicalUrl('/products') },
    { name: category.name, url },
  ]);

  // GEO: CollectionPage entity for this category
  const collectionPageSchema = buildCollectionPageSchema({
    name: `${category.name} — ExTell Systems`,
    url,
    description: `Enterprise ${category.name} products for data centers, telecom networks, and industrial environments. Sourced and distributed by ExTell Systems across 20+ countries.`,
  });

  // GEO: ItemList of sibling categories (helps AI understand site taxonomy)
  const siblingItemList = buildItemListSchema(
    'Product Categories',
    canonicalUrl('/products'),
    categories.map((cat) => ({
      name: cat.name,
      url: canonicalUrl(`/category/${cat.slug}`),
    }))
  );

  // GEO: WebPage entity
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: `${category.name} | ExTell Systems`,
    description: `Enterprise ${category.name} from ExTell Systems.`,
    isPartOf: { '@id': WEBSITE_ID },
    breadcrumb: breadcrumbSchema,
  };

  // AEO: category-specific FAQ — People Also Ask for category queries
  const categoryFAQSchema = buildCategoryFAQSchema(category.name, url);

  return (
    <SiteLayoutWrapper>
      {/* AEO: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* GEO: CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {/* GEO: sibling category ItemList — site taxonomy for AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siblingItemList) }}
      />
      {/* GEO: WebPage entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {/* AEO: category FAQ — People Also Ask */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryFAQSchema) }}
      />
      <CategoryPage slug={slug} />
    </SiteLayoutWrapper>
  );
}
