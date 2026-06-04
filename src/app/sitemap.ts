import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

const BASE_URL = 'https://extellsystems.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  const productUrls = products.map((product: any) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...productUrls];
}