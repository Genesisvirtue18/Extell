import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';
import { getProductSlug } from '@/lib/productUrl';
import { categories as siteCategories, products as siteProducts } from '@/data/siteData';

const BASE_URL = 'https://extellsystems.com';

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
  try {
    const products = await fetchAllProducts();

    const productSource = products.length ? products : siteProducts;
    const categorySource = siteCategories;

    const productUrls: MetadataRoute.Sitemap = productSource.map((product: any) => {
      const slug = product.slug || getProductSlug(product);

      return {
        url: buildAbsoluteUrl(`/product/${encodeURIComponent(slug)}`),
        lastModified: asLastModified(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

    const categoryUrls: MetadataRoute.Sitemap = categorySource.map((category) => ({
      url: buildAbsoluteUrl(`/category/${encodeURIComponent(category.slug)}`),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

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
        priority: 0.9,
      },
      {
        url: buildAbsoluteUrl('/solutions'),
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
        url: buildAbsoluteUrl('/case-studies'),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: buildAbsoluteUrl('/certifications'),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: buildAbsoluteUrl('/downloads'),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: buildAbsoluteUrl('/industry-solutions'),
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
        url: buildAbsoluteUrl('/ups-calculator'),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: buildAbsoluteUrl('/warranty'),
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ];

    return [...staticUrls, ...categoryUrls, ...productUrls];
  } catch (error) {
    console.error('Sitemap generation error:', error);

    return [
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
        priority: 0.9,
      },
      {
        url: buildAbsoluteUrl('/solutions'),
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
    ];
  }
}
