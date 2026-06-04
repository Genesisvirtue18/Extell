import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/api';

const BASE_URL = 'https://extellsystems.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const productsResponse = await getProducts();

    // Ensure products is always an array
    const products = Array.isArray(productsResponse)
      ? productsResponse
      : Array.isArray(productsResponse?.data)
      ? productsResponse.data
      : [];

    const productUrls: MetadataRoute.Sitemap = products.map(
      (product: any) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    );

    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];

    return [...staticUrls, ...productUrls];
  } catch (error) {
    console.error('Sitemap generation error:', error);

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }
}