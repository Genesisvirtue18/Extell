/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Proxy API requests to Express backend
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
        },
      ],
    };
  },
  // Redirect old name-based product slugs to the new ID-based URLs.
  redirects: async () => {
    // ── Static redirects for old WordPress/legacy URLs that Google has indexed ──
    // These were causing 526 404 errors in Google Search Console.
    const staticRedirects = [
      // Old WordPress shop/product URLs → current equivalents
      { source: '/shop', destination: '/products', permanent: true },
      { source: '/shop/:path*', destination: '/products', permanent: true },
      { source: '/store', destination: '/products', permanent: true },
      { source: '/store/:path*', destination: '/products', permanent: true },
      // WordPress category archive URLs → our category pages
      { source: '/product-category/:slug', destination: '/category/:slug', permanent: true },
      { source: '/product-category/:slug/', destination: '/category/:slug', permanent: true },
      // WordPress tag/author/date archive URLs → home
      { source: '/tag/:path*', destination: '/', permanent: true },
      { source: '/author/:path*', destination: '/about', permanent: true },
      // Old WordPress admin/system paths → gone
      { source: '/wp-admin', destination: '/', permanent: true },
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/xmlrpc.php', destination: '/', permanent: true },
      // Old "products" with trailing slash or page query
      { source: '/products/', destination: '/products', permanent: true },
      // Old contact/about URL variants
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/contact-us/', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-us/', destination: '/about', permanent: true },
      // Old blog/news paths → home
      { source: '/blog', destination: '/', permanent: true },
      { source: '/blog/:path*', destination: '/', permanent: true },
      { source: '/news', destination: '/', permanent: true },
      { source: '/news/:path*', destination: '/', permanent: true },
    ];

    let dynamicRedirects = [];

    try {
      // Build-time: fetch all products and generate permanent redirects
      // from old name-slug form to the authoritative ID form.
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/products?limit=500`, {
        signal: AbortSignal.timeout(8000),
      }).catch(() => null);
      if (res?.ok) {
        const data = await res.json().catch(() => null);
        const items = data?.items || (Array.isArray(data) ? data : []);

        const slugify = (str) =>
          String(str || '')
            .trim()
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const getProductId = (p) =>
          String(p?.SKU || p?.sku || p?.id || p?._id || '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-');

        for (const product of items) {
          const apiSlug = String(product?.slug || '').toLowerCase().trim();
          const nameslug = slugify(product?.Name || product?.name || '');
          const sku = getProductId(product);

          if (apiSlug && nameslug && apiSlug !== nameslug) {
            dynamicRedirects.push({
              source: `/product/${nameslug}`,
              destination: `/product/${apiSlug}`,
              permanent: true,
            });
          }

          if (apiSlug && sku && apiSlug !== sku) {
            dynamicRedirects.push({
              source: `/product/${sku}`,
              destination: `/product/${apiSlug}`,
              permanent: true,
            });
          }
        }
      }
    } catch {
      // API unavailable at build time — skip dynamic redirects
    }

    return [...staticRedirects, ...dynamicRedirects];
  },
};

export default nextConfig;
