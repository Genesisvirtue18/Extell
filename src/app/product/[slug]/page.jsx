import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPageContent from '@/pages/ProductDetailPage';
import { getProductBySlug } from '@/lib/api';

const BASE_URL = 'https://extellsystems.com';

export async function generateMetadata({ params }) {
  try {
    const { getProductBySlug } = await import('@/lib/api');
    const res = await getProductBySlug(params.slug);
    const product = res?.item;

    if (!product) {
      return {
        title: 'Product Not Found | Extell Systems',
        description: 'The product you are looking for could not be found.',
      };
    }

    const url = `${BASE_URL}/product/${product.slug || params.slug}`;
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
        type: 'product',
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: product.name,
            type: 'image/jpeg',
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Extell Systems',
      description: 'Explore our premium power solutions and industrial equipment.',
    };
  }
}

export default async function Page({ params }) {
  const normalizedSlug = String(params.slug || '').toLowerCase().trim();

  let product = null;

  try {
    const slugResponse = await getProductBySlug(normalizedSlug).catch(() => null);

    product = slugResponse?.item || null;

    if (!product && normalizedSlug) {
      const idResponse = await getProductById(normalizedSlug).catch(() => null);
      product = idResponse?.item || null;
    }

    if (!product && normalizedSlug) {
      const { products: seedProducts } = await import('@/data/siteData');
      const { findProductBySlug } = await import('@/lib/productUrl');
      product = findProductBySlug(seedProducts, normalizedSlug) || null;
    }

  } catch (e) {
    console.error(e);
  }

  if (!product) {
    notFound();
  }

  return (
    <SiteLayoutWrapper>
      <ProductDetailPageContent slug={params.slug} />
    </SiteLayoutWrapper>
  );
}
