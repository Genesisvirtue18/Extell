import { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Internal admin
          '/admin',
          '/admin/',
          // WordPress paths (old site leftovers — block to stop crawl budget waste)
          '/wp-admin/',
          '/wp-login.php',
          '/wp-content/',
          '/wp-includes/',
          '/wp-json/',
          '/xmlrpc.php',
          '/feed/',
          '/feed',
          '/?feed=',
          '/?p=',
          '/?page_id=',
          '/?cat=',
          '/?tag=',
          '/?author=',
          // Search/filter pages with query parameters that create duplicate content
          // (canonicals are set in metadata, but blocking stops crawl budget waste)
          '/products?page=',
          '/search',
          '/search/',
          // Calculator sub-routes (noindex already, but block saves crawl budget)
          '/ups-calculator/',
        ],
      },
    ],
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
    host: CANONICAL_SITE_URL,
  };
}
