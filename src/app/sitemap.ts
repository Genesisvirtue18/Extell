import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { getProductUrlParam } from '@/lib/productUrl';
import { CANONICAL_SITE_URL } from '@/lib/siteUrl';
import { products as siteProducts, categories as siteCategories } from '@/data/siteData';

const BASE_URL = CANONICAL_SITE_URL;

const buildAbsoluteUrl = (path: string) => `${BASE_URL}${path}`;

const getResponseProducts = (response: any) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.products)) return response.products;
  return [];
};

const asLastModified = (value: unknown) => {
  const date = value ? new Date(value as string | number | Date) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const fetchAllProducts = async () => {
  const allProducts: any[] = [];
  const pageSize = 300;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getProducts({ page, limit: pageSize });
    const pageProducts = getResponseProducts(response);

    if (page === 1 && Array.isArray(response)) {
      return response;
    }

    allProducts.push(...pageProducts);

    const responseTotalPages =
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
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: any[] = [];

  try {
    products = await fetchAllProducts();
  } catch {
    products = [];
  }

  const productSource = products.length ? products : siteProducts;

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: buildAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: buildAbsoluteUrl('/products'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: buildAbsoluteUrl('/solutions'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: buildAbsoluteUrl('/industry-solutions'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: buildAbsoluteUrl('/support'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: buildAbsoluteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: buildAbsoluteUrl('/contact'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: buildAbsoluteUrl('/certifications'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: buildAbsoluteUrl('/case-studies'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: buildAbsoluteUrl('/partner'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: buildAbsoluteUrl('/downloads'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: buildAbsoluteUrl('/warranty'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: buildAbsoluteUrl('/careers'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: buildAbsoluteUrl('/ups-calculator'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const categoryUrls: MetadataRoute.Sitemap = siteCategories.map((cat) => ({
    url: buildAbsoluteUrl(`/category/${cat.slug}`),
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productUrls: MetadataRoute.Sitemap = productSource.map((product: any) => {
    const id = getProductUrlParam(product);
    return {
      url: buildAbsoluteUrl(`/product/${encodeURIComponent(id)}`),
      lastModified: asLastModified(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
