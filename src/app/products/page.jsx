import { Suspense } from 'react';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductsPage from '@/pages/ProductsPage';
import { getProducts } from '@/lib/api';
import { products as siteProducts } from '@/data/siteData';
import { canonicalUrl } from '@/lib/siteUrl';
import {
  buildCollectionPageSchema,
  buildBreadcrumbSchema,
  WEBSITE_ID,
} from '@/lib/schemas';

export const metadata = {
  title: 'UPS Systems, Fiber & ICT Products | ExTell Systems',
  description:
    'Browse UPS systems, fiber optic cables, structured cabling, data center PDUs, and ICT infrastructure products from ExTell Systems. Enterprise-grade hardware shipped to 20+ countries.',
  alternates: {
    canonical: canonicalUrl('/products'),
  },
  openGraph: {
    title: 'UPS Systems, Fiber & ICT Products | ExTell Systems',
    description:
      'Shop enterprise UPS systems, fiber cables, structured cabling, and ICT infrastructure from ExTell Systems.',
    url: canonicalUrl('/products'),
    siteName: 'ExTell Systems',
    type: 'website',
  },
};

const url = canonicalUrl('/products');

// GEO: CollectionPage entity — tells AI crawlers this is a product catalog
const collectionPageSchema = buildCollectionPageSchema({
  name: 'UPS Systems, Fiber & ICT Infrastructure Products',
  url,
  description:
    'Comprehensive catalog of enterprise UPS systems, fiber optic cables, data center power distribution units, structured cabling systems, and ICT networking products from ExTell Systems.',
});

// AEO: BreadcrumbList for SERP rich result
const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: canonicalUrl('/') },
  { name: 'Products', url },
]);

// GEO: WebPage entity for this page
const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${url}#webpage`,
  url,
  name: 'UPS Systems, Fiber & ICT Infrastructure Products',
  description:
    'Browse the full ExTell Systems product catalog — UPS, fiber, data center infrastructure, and more.',
  isPartOf: { '@id': WEBSITE_ID },
  breadcrumb: breadcrumbSchema,
};

export default async function Page() {
  let initialProducts = [];
  let initialCategories = [];
  let initialPagination = { total: 0, page: 1, totalPages: 1, limit: 12 };

  try {
    const response = await getProducts({ page: 1, limit: 12 });
    initialProducts = response?.items || [];
    initialCategories = response?.filters?.categories || [];
    initialPagination = response?.pagination || initialPagination;
  } catch {
    initialProducts = siteProducts;
  }

  return (
    <SiteLayoutWrapper>
      {/* GEO: CollectionPage catalog entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {/* AEO: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* GEO: WebPage entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Suspense fallback={<p className="p-8 text-center">Loading products...</p>}>
        <ProductsPage
          initialProducts={initialProducts}
          initialCategories={initialCategories}
          initialPagination={initialPagination}
        />
      </Suspense>
    </SiteLayoutWrapper>
  );
}
