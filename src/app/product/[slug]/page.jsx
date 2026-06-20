import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';
import { canonicalUrl } from '@/lib/siteUrl';
import { getProductBySlug, getProductById } from '@/lib/api';
import { getProductId, getProductSlug } from '@/lib/productUrl';
import { products as siteProducts } from '@/data/siteData';

// Normalise whatever comes in from the URL param
function normaliseParam(raw) {
  return String(raw || '').toLowerCase().trim();
}

// Resolve a product by URL param — tries ID first, then name-slug, then static data
async function resolveProduct(param) {
  const p = normaliseParam(param);
  let product = null;

  try {
    // 1. Primary: look up by product ID / SKU (the canonical URL format)
    const byId = await getProductById(p).catch(() => null);
    product = byId?.item || null;

    // 2. Fallback: slug-based lookup (handles old name-slug URLs gracefully)
    if (!product) {
      const bySlug = await getProductBySlug(p).catch(() => null);
      product = bySlug?.item || null;
    }

    // 3. Static-data fallback — match by ID/SKU, then by name-slug
    if (!product) {
      const { findProductById, findProductBySlug } = await import('@/lib/productUrl');
      product =
        findProductById(siteProducts, p) ||
        findProductBySlug(siteProducts, p) ||
        null;
    }
  } catch (err) {
    console.error('resolveProduct error:', err);
  }

  return product;
}

// ─── Static params — use product ID/SKU as the URL segment ───────────────────
export async function generateStaticParams() {
  try {
    const { getProducts } = await import('@/lib/api');
    const response = await getProducts({ limit: 500 });
    const items = response?.items || (Array.isArray(response) ? response : []);
    if (items.length) {
      return items
        .map((p) => ({ slug: getProductId(p) }))
        .filter((p) => p.slug);
    }
  } catch {}
  // Static-data fallback
  return siteProducts
    .map((p) => ({ slug: getProductId(p) }))
    .filter((p) => p.slug);
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | ExTell Systems',
      description: 'The product you are looking for could not be found.',
    };
  }

  const productName = product?.Name || product?.name || 'Product';
  const sku = product?.SKU || product?.sku || product?.id || '';
  const productCategory =
    product?.topCategory || product?.Categories || product?.category || 'Products';
  const url = canonicalUrl(`/product/${getProductId(product)}`);
  const productImage =
    product?.images?.[0] ||
    product?.imageList?.[0] ||
    product?.heroImage ||
    canonicalUrl('/assets/placeholder-tech.svg');

  const titleSku = sku ? ` — ${sku.toUpperCase()}` : '';
  const descriptionBase =
    product.shortDescription ||
    (product.description ? String(product.description).slice(0, 120) : null) ||
    `Premium ${productCategory} from ExTell Systems`;

  return {
    title: `${productName}${titleSku} | ExTell Systems`,
    description: sku
      ? `${descriptionBase} Model: ${sku.toUpperCase()}.`
      : descriptionBase,
    keywords: [
      productName,
      sku,
      sku.toUpperCase(),
      productCategory,
      'UPS',
      'power solutions',
      'ICT infrastructure',
      'ExTell Systems',
    ].filter(Boolean),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${productName}${titleSku}`,
      description: sku
        ? `${descriptionBase} Model: ${sku.toUpperCase()}.`
        : descriptionBase,
      url,
      siteName: 'ExTell Systems',
      type: 'website',
      images: [{ url: productImage, width: 1200, height: 630, alt: productName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName}${titleSku}`,
      description: sku
        ? `${descriptionBase} Model: ${sku.toUpperCase()}.`
        : descriptionBase,
      images: [productImage],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function Page({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    notFound();
  }

  const name = product?.Name || product?.name || 'Product';
  const sku = product?.SKU || product?.sku || product?.id || '';
  const url = canonicalUrl(`/product/${getProductId(product)}`);
  const productImage =
    product?.images?.[0] ||
    product?.imageList?.[0] ||
    product?.heroImage ||
    canonicalUrl('/assets/placeholder-tech.svg');

  const categoryPath = String(
    product?.Categories || product?.topCategory || product?.category || ''
  )
    .split('>')
    .map((part) => part.split(',')[0].trim())
    .filter(Boolean);

  const breadcrumbItems = [
    { name: 'Home', url: canonicalUrl('/') },
    ...categoryPath.map((cat) => ({ name: cat, url: canonicalUrl('/products') })),
    { name, url },
  ];

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(sku ? { sku: sku.toUpperCase(), mpn: sku.toUpperCase() } : {}),
    image: product.imageList?.length
      ? product.imageList
      : product.images?.length
      ? product.images
      : [productImage],
    description: product.description || product.descriptionText || name,
    brand: { '@type': 'Brand', name: 'ExTell Systems' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      ...(product.price && !Number.isNaN(Number(product.price))
        ? { price: Number(product.price) }
        : {}),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <SiteLayoutWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailPageContent slug={slug} initialProduct={product} />
    </SiteLayoutWrapper>
  );
}
