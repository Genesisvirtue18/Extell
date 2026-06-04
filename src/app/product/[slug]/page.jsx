import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';

import { getProductBySlug, getProductById } from '@/lib/api';

const BASE_URL = 'https://extellsystems.com';

// ✅ helper (VERY IMPORTANT)
function normalizeSlug(slug) {
  return String(slug || '').toLowerCase().trim();
}

// ✅ shared product resolver (used in BOTH places)
async function resolveProduct(slug) {
  const normalizedSlug = normalizeSlug(slug);

  let product = null;

  try {
    // 1️⃣ Try slug API
    const slugRes = await getProductBySlug(normalizedSlug).catch(() => null);
    product = slugRes?.item || null;

    // 2️⃣ Try ID fallback
    if (!product && normalizedSlug) {
      const idRes = await getProductById(normalizedSlug).catch(() => null);
      product = idRes?.item || null;
    }

    // 3️⃣ Try static/local fallback
    if (!product && normalizedSlug) {
      const { products: seedProducts } = await import('@/data/siteData');
      const { findProductBySlug } = await import('@/lib/productUrl');

      product = findProductBySlug(seedProducts, normalizedSlug) || null;
    }

  } catch (err) {
    console.error('Resolve product error:', err);
  }

  return product;
}

// ✅ METADATA
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Extell Systems',
      description: 'The product you are looking for could not be found.',
    };
  }

  const url = `${BASE_URL}/product/${slug}`;

  const productImage =
    product.images?.[0] ||
    product.imageList?.[0] ||
    product.heroImage ||
    `${BASE_URL}/assets/placeholder-tech.svg`;

  return {
    title: `${product.name} | Extell Systems`,
    description:
      product.shortDescription ||
      product.description?.slice(0, 160) ||
      `Premium ${product.category} from Extell Systems`,

    keywords: [
      product.name,
      product.category,
      'power solutions',
      'industrial equipment',
      'UPS',
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: product.name,
      description:
        product.shortDescription ||
        product.description?.slice(0, 160),
      url,
      siteName: 'Extell Systems',
      type: 'website',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description:
        product.shortDescription ||
        product.description?.slice(0, 160),
      images: [productImage],
    },
  };
}

// ✅ PAGE
export default async function Page({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <SiteLayoutWrapper>
      <ProductDetailPageContent slug={slug} />
    </SiteLayoutWrapper>
  );
}
