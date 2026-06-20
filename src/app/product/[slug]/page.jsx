import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';
import { canonicalUrl } from '@/lib/siteUrl';
import { getProductBySlug, getProductById } from '@/lib/api';
import { getProductSlug } from '@/lib/productUrl';
import { products as siteProducts } from '@/data/siteData';

function normalizeSlug(slug) {
  return String(slug || '').toLowerCase().trim();
}

async function resolveProduct(slug) {
  const normalizedSlug = normalizeSlug(slug);
  let product = null;

  try {
    const slugRes = await getProductBySlug(normalizedSlug).catch(() => null);
    product = slugRes?.item || null;

    if (!product && normalizedSlug) {
      const idRes = await getProductById(normalizedSlug).catch(() => null);
      product = idRes?.item || null;
    }

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

export async function generateStaticParams() {
  try {
    const { getProducts } = await import('@/lib/api');
    const response = await getProducts({ limit: 500 });
    const items = response?.items || (Array.isArray(response) ? response : []);
    if (items.length) {
      return items
        .map((p) => ({ slug: p.slug || getProductSlug(p) }))
        .filter((p) => p.slug);
    }
  } catch {}
  return siteProducts
    .map((p) => ({ slug: getProductSlug(p) }))
    .filter((p) => p.slug);
}

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
  const productCategory =
    product?.topCategory || product?.Categories || product?.category || 'Products';
  const url = canonicalUrl(`/product/${slug}`);
  const productImage =
    product?.images?.[0] ||
    product?.imageList?.[0] ||
    product?.heroImage ||
    canonicalUrl('/assets/placeholder-tech.svg');

  return {
    title: `${productName} | ExTell Systems`,
    description:
      product.shortDescription ||
      (product.description ? String(product.description).slice(0, 160) : null) ||
      `Premium ${productCategory} from ExTell Systems`,
    keywords: [productName, productCategory, 'power solutions', 'UPS', 'ICT infrastructure'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: productName,
      description:
        product.shortDescription ||
        (product.description ? String(product.description).slice(0, 160) : null),
      url,
      siteName: 'ExTell Systems',
      type: 'website',
      images: [{ url: productImage, width: 1200, height: 630, alt: productName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description:
        product.shortDescription ||
        (product.description ? String(product.description).slice(0, 160) : null),
      images: [productImage],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    notFound();
  }

  const name = product?.Name || product?.name || 'Product';
  const url = canonicalUrl(`/product/${slug}`);
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
