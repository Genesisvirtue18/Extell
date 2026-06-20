import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';
import { canonicalUrl } from '@/lib/siteUrl';
import { getProductBySlug, getProductById } from '@/lib/api';
import { getProductId, getProductSlug } from '@/lib/productUrl';
import { products as siteProducts } from '@/data/siteData';
import {
  buildProductSchema,
  buildProductFAQSchema,
  buildBreadcrumbSchema,
  ORG_ID,
  WEBSITE_ID,
} from '@/lib/schemas';

function normaliseParam(raw) {
  return String(raw || '').toLowerCase().trim();
}

async function resolveProduct(param) {
  const p = normaliseParam(param);
  let product = null;

  try {
    const byId = await getProductById(p).catch(() => null);
    product = byId?.item || null;

    if (!product) {
      const bySlug = await getProductBySlug(p).catch(() => null);
      product = bySlug?.item || null;
    }

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

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const { getProducts } = await import('@/lib/api');
    const response = await getProducts({ limit: 500 });
    const items = response?.items || (Array.isArray(response) ? response : []);
    if (items.length) {
      return items.map((p) => ({ slug: getProductId(p) })).filter((p) => p.slug);
    }
  } catch {}
  return siteProducts.map((p) => ({ slug: getProductId(p) })).filter((p) => p.slug);
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
  const url = canonicalUrl(`/product/${getProductId(product)}`);
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
    description: sku
      ? `${descriptionBase} Model: ${sku}.`
      : descriptionBase,
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
  const url = canonicalUrl(`/product/${getProductId(product)}`);

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

  // ── Product schema (GEO: full product entity with specs as additionalProperty) ──
  const productSchemaObj = buildProductSchema(product, url);

  // ── BreadcrumbList (AEO: breadcrumb rich result) ──────────────────────────
  const breadcrumbSchemaObj = buildBreadcrumbSchema(breadcrumbItems);

  // ── FAQPage (AEO: People Also Ask + voice search) ─────────────────────────
  const faqSchemaObj = buildProductFAQSchema(product, url);

  // ── WebPage entity (GEO: connects page to site/org entities) ──────────────
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
      {/* GEO: Full product entity with SKU, MPN, specs, brand, seller */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemaObj) }}
      />
      {/* AEO: BreadcrumbList for rich breadcrumb in SERPs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaObj) }}
      />
      {/* AEO: FAQ rich result — People Also Ask + voice-search answers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaObj) }}
      />
      {/* GEO: ItemPage + Speakable entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <ProductDetailPageContent slug={slug} initialProduct={product} />
    </SiteLayoutWrapper>
  );
}
