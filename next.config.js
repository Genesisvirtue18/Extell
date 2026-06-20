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
  // The product page resolver handles ID-first lookup, so visiting
  // /product/<name-slug> still works via the fallback — but any link
  // that Google already knows about (301) gets pointed at the canonical URL.
  redirects: async () => {
    let redirectList = [];

    try {
      // Build-time: fetch all products from the API and generate permanent
      // redirects from the old name-slug form to the authoritative ID form.
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/products?limit=500`).catch(() => null);
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
          // apiSlug is the canonical param the backend knows about
          const apiSlug = String(product?.slug || '').toLowerCase().trim();
          const nameslug = slugify(product?.Name || product?.name || '');
          const sku = getProductId(product);

          // If the API provides a slug, and it's not the same as the name slug,
          // redirect the name slug → api slug.
          if (apiSlug && nameslug && apiSlug !== nameslug) {
            redirectList.push({
              source: `/product/${nameslug}`,
              destination: `/product/${apiSlug}`,
              permanent: true,
            });
          }

          // Also redirect raw SKU URLs → the canonical api slug.
          if (apiSlug && sku && apiSlug !== sku) {
            redirectList.push({
              source: `/product/${sku}`,
              destination: `/product/${apiSlug}`,
              permanent: true,
            });
          }
        }
      }
    } catch {
      // API unavailable at build time — skip redirects, pages still resolve
    }

    return redirectList;
  },
};

export default nextConfig;
