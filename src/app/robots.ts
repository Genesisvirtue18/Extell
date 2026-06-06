import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://extellsystems.com');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
