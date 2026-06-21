import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';
import { canonicalUrl } from '@/lib/siteUrl';
import { getProductBySlug, getProductById, getProducts } from '@/lib/api';
import { getProductId, getProductUrlParam } from '@/lib/productUrl';
import { products as siteProducts } from '@/data/siteData';
import {
  buildProductSchema,
  buildProductFAQSchema,
  buildBreadcrumbSchema,
  WEBSITE_ID,
} from '@/lib/schemas';

function normaliseParam(raw) {
  return String(raw || '').toLowerCase().trim();
}

async function resolveProduct(param) {
  const p = normaliseParam(param);
  let product = null;

  try {
    // 1. Try backend slug lookup (covers name-slug URLs like /product/spirent-firehawk)
    const bySlug = await getProductBySlug(p).catch(() => null);
    product = bySlug?.item || null;

    // 2. Try backend ID lookup (covers MongoDB ObjectId in the URL, rare)
    if (!product) {
      const byId = await getProductById(p).catch(() => null);
      product = byId?.item || null;
    }

    // 3. Try text search — covers SKU-as-URL-param like /product/e003spir31.
    //    Searches products for the param, then picks the one whose SKU or slug matches.
    if (!product) {
      const searchRes = await getProducts({ q: p, limit: 20 }).catch(() => null);
      const items = searchRes?.items || [];
      product =
        items.find((item) => {
          const sku = (item?.SKU || item?.sku || '').toLowerCase().replace(/\s+/g, '-');
          const slug = (item?.slug || '').toLowerCase();
          return sku === p || slug === p;
        }) || null;
    }

    // 4. Static-data fallback
    if (!product) {
      const { findProductById, findProductBySlug } = await import('@/lib/productUrl');
      product =
        findProductById(siteProducts, p) || findProductBySlug(siteProducts, p) || null;
    }
  } catch (err) {
    console.error('resolveProduct error:', err);
  }

  return product;
}

// ISR: revalidate every hour so Googlebot always gets a cached response
// even if the Render backend is sleeping (prevents 5xx in Search Console).
export const revalidate = 3600;

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const { getProducts } = await import('@/lib/api');
    const response = await getProducts({ limit: 500 });
    const items = response?.items || (Array.isArray(response) ? response : []);
    if (items.length) {
      return items
        .map((p) => ({ slug: getProductUrlParam(p) }))
        .filter((p) => p.slug);
    }
  } catch {}
  return siteProducts
    .map((p) => ({ slug: getProductUrlParam(p) }))
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
  const sku = (product?.SKU || product?.sku || product?.id || '').toUpperCase();
  const productCategory =
    product?.topCategory || product?.Categories || product?.category || 'Products';
  const url = canonicalUrl(`/product/${getProductUrlParam(product)}`);
  const productImage =
    product?.images?.[0] ||
    product?.imageList?.[0] ||
    product?.heroImage ||
    canonicalUrl('/assets/placeholder-tech.svg');

  const titleSku = sku ? ` — ${sku}` : '';
  const descriptionBase =
    product.shortDescription ||
    (product.description ? String(product.description).slice(0, 120) : null) ||
    `Premium ${productCategory} from ExTell Systems`;

  return {
    title: `${productName}${titleSku} | ExTell Systems`,
    description: sku ? `${descriptionBase} Model: ${sku}.` : descriptionBase,
    keywords: [
      productName,
      sku,
      productCategory,
      'UPS',
      'power solutions',
      'ICT infrastructure',
      'ExTell Systems',
    ].filter(Boolean),
    alternates: { canonical: url },
    openGraph: {
      title: `${productName}${titleSku}`,
      description: sku ? `${descriptionBase} Model: ${sku}.` : descriptionBase,
      url,
      siteName: 'ExTell Systems',
      type: 'website',
      images: [{ url: productImage, width: 1200, height: 630, alt: productName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName}${titleSku}`,
      description: sku ? `${descriptionBase} Model: ${sku}.` : descriptionBase,
      images: [productImage],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function Page({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) notFound();

  const name = product?.Name || product?.name || 'Product';
  const sku = (product?.SKU || product?.sku || product?.id || '').toUpperCase();
  const url = canonicalUrl(`/product/${getProductUrlParam(product)}`);

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

  const productSchemaObj = buildProductSchema(product, url);
  const breadcrumbSchemaObj = buildBreadcrumbSchema(breadcrumbItems);
  const faqSchemaObj = buildProductFAQSchema(product, url);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@id': `${url}#webpage`,
    url,
    name: `${name}${sku ? ` — ${sku}` : ''}`,
    description:
      product.shortDescription ||
      (product.description ? String(product.description).slice(0, 160) : name),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': `${url}#product` },
    breadcrumb: breadcrumbSchemaObj,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.product-detail-copy', '.product-detail-kicker'],
    },
  };

  return (
    <SiteLayoutWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemaObj) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaObj) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaObj) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <ProductDetailPageContent slug={slug} initialProduct={product} />
    </SiteLayoutWrapper>
  );
}
