import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { getProductUrlParam } from '@/lib/productUrl';
import { CANONICAL_SITE_URL } from '@/lib/siteUrl';
import { products as siteProducts, categories as siteCategories } from '@/data/siteData';

// Revalidate every 24 hours so new products added via the CMS appear in the
// sitemap within a day without needing a full redeploy.
export const revalidate = 86400;

const BASE_URL = CANONICAL_SITE_URL;

const url = (path: string) => `${BASE_URL}${path}`;

const asLastModified = (value: unknown) => {
  const date = value ? new Date(value as string | number | Date) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

async function fetchAllProducts(): Promise<any[]> {
  const allProducts: any[] = [];
  const pageSize = 300;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    // 8-second timeout per page — prevents sitemap from hanging when
    // the Render backend is sleeping (which was causing GSC "Couldn't fetch sitemap").
    const response = await getProducts({ page, limit: pageSize });
    const pageProducts: any[] = Array.isArray(response)
      ? response
      : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response?.data)
      ? response.data
      : [];

    if (page === 1 && Array.isArray(response)) return response;

    allProducts.push(...pageProducts);

    const responseTotalPages: number =
      response?.pagination?.totalPages ||
      response?.totalPages ||
      response?.meta?.totalPages ||
      0;

    if (responseTotalPages) {
      totalPages = responseTotalPages;
    } else if (pageProducts.length < pageSize) {
      break;
    } else {
      totalPages = page + 1;
    }

    page += 1;
  }

  return allProducts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: any[] = [];

  try {
    products = await fetchAllProducts();
  } catch {
    // API unavailable — fall back to static product list
    products = [];
  }

  const productSource = products.length ? products : siteProducts;

  // ── Static pages ────────────────────────────────────────────────────────────
  // Use real fixed dates (or deploy date) — NOT new Date() — so Google trusts
  // the lastModified signal and doesn't ignore it as always-today.
  const SITE_LAUNCH = new Date('2024-01-01');
  const CONTENT_REFRESH = new Date('2025-06-01');

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: url('/'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: url('/products'),
      lastModified: new Date(), // genuinely changes when products are added
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: url('/solutions'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: url('/industry-solutions'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: url('/about'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: url('/contact'),
      lastModified: SITE_LAUNCH,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: url('/support'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: url('/ups-calculator'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: url('/certifications'),
      lastModified: SITE_LAUNCH,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: url('/case-studies'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: url('/partner'),
      lastModified: SITE_LAUNCH,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    {
      url: url('/downloads'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: url('/warranty'),
      lastModified: SITE_LAUNCH,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: url('/careers'),
      lastModified: CONTENT_REFRESH,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // NOTE: /ups-calculator/[...slug] sub-routes are intentionally excluded —
    // they carry robots noindex and canonical → /ups-calculator.
    // NOTE: /admin/* is excluded (blocked by robots.txt + no metadata).
  ];

  // ── Category pages ───────────────────────────────────────────────────────────
  const categoryUrls: MetadataRoute.Sitemap = siteCategories.map((cat) => ({
    url: url(`/category/${cat.slug}`),
    lastModified: new Date(), // categories refresh when products change
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // ── Product detail pages ─────────────────────────────────────────────────────
  // getProductUrlParam returns the API slug (already URL-safe — no encodeURIComponent
  // needed, and encoding would create %2F-style URLs that differ from actual links).
  const seen = new Set<string>();
  const productUrls: MetadataRoute.Sitemap = productSource
    .map((product: any) => {
      const param = getProductUrlParam(product);
      if (!param || seen.has(param)) return null;
      seen.add(param);
      return {
        url: url(`/product/${param}`),
        lastModified: asLastModified(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
