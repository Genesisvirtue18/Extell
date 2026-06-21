'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Download, FileText, X, ZoomIn } from 'lucide-react';
import { getProductById, getProductBySlug, getProducts, submitQuoteRequest } from '../lib/api';
import { getProductPath } from '../lib/productUrl';

const placeholderImage = '/assets/placeholder-tech.svg';

const toDetailRows = (product) => {
  if (Array.isArray(product.detailRows) && product.detailRows.length) return product.detailRows;
  if (product.specs && typeof product.specs === 'object') {
    return Object.entries(product.specs).map(([parameter, value]) => ({ parameter, value }));
  }
  return [];
};

const pickBestProductImage = (item) => {
  const imageList = Array.isArray(item?.imageList) ? item.imageList : [];
  const candidates = [item?.heroImage, ...imageList].filter(Boolean);
  if (!candidates.length) return placeholderImage;

  const scoreImage = (entry) => {
    const value = String(entry || '').toLowerCase();
    let score = 0;
    if (value.includes('/elementor/thumbs/')) score -= 40;
    if (value.includes('front-hero') || value.includes('hero')) score -= 20;
    if (value.includes('iso')) score += 18;
    if (value.includes('side') || value.includes('rear') || value.includes('front')) score += 8;
    return score;
  };

  return [...candidates].sort((a, b) => scoreImage(b) - scoreImage(a))[0] || placeholderImage;
};

const parseCategoryPath = (rawValue) =>
  String(rawValue || '')
    .split('>')
    .map((part) => part.split(',')[0].trim())
    .filter(Boolean);

const getInitialImage = (product) => {
  if (!product) return placeholderImage;
  const list = Array.isArray(product.imageList) ? product.imageList : [];
  return [product.heroImage, ...list].filter(Boolean)[0] || placeholderImage;
};

function ProductDetailPage({ slug, initialProduct }) {
  const router = useRouter();

  // useRef tracks whether we should skip the first useEffect fetch
  // (i.e. we already have initialProduct from SSR)
  const skipFirstFetch = useRef(Boolean(initialProduct));

  const [product, setProduct] = useState(initialProduct || null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(() => getInitialImage(initialProduct));
  const [zoomedImage, setZoomedImage] = useState('');
  const [quoteForm, setQuoteForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    requirements: ''
  });
  const [quoteStatus, setQuoteStatus] = useState({ type: '', message: '' });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    // On first mount with initialProduct from SSR, skip the API fetch.
    // On subsequent slug changes (client-side navigation), fetch fresh data.
    if (skipFirstFetch.current) {
      skipFirstFetch.current = false;
      // Still fetch related products if we have initialProduct
      getProducts({ limit: 8 })
        .then((res) => {
          const items = res?.items || [];
          setRelated(items.filter((item) => item.id !== initialProduct?.id).slice(0, 4));
        })
        .catch(() => {});
      return;
    }

    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const normalizedSlug = String(slug || '').toLowerCase().trim();
        const [slugResponse, relatedResponse] = await Promise.all([
          getProductBySlug(normalizedSlug).catch(() => null),
          getProducts({ limit: 8 })
        ]);
        if (!mounted) return;

        let selected = slugResponse?.item || null;
        if (!selected && normalizedSlug) {
          selected = (await getProductById(normalizedSlug).catch(() => null))?.item || null;
        }
        if (!selected) throw new Error('Product not found');

        const relatedItems = (relatedResponse?.items || [])
          .filter((item) => item.id !== selected.id)
          .slice(0, 4);

        setProduct(selected);
        setRelated(relatedItems);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unable to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const list = product.imageList?.length ? product.imageList : [];
    return [product.heroImage, ...list].filter(Boolean).slice(0, 6);
  }, [product]);

  useEffect(() => {
    if (gallery.length) setActiveImage(gallery[0]);
  }, [gallery]);

  useEffect(() => {
    if (!zoomedImage) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setZoomedImage('');
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomedImage]);

  const detailRows = useMemo(() => (product ? toDetailRows(product) : []), [product]);
  const features = product?.features || [];
  const name = product?.Name || product?.name || 'Product';
  const sku = product?.SKU || product?.sku || product?.id || '';
  const description = product?.descriptionText || product?.description || product?.short || '';
  const category = product?.topCategory || product?.Categories || product?.category || 'Products';
  const datasheet = product?.datasheet || '';
  const categoryPath = parseCategoryPath(product?.Categories || category || '');
  const breadcrumbItems = ['Home', ...categoryPath, name];
  const similarProducts = related.slice(0, 3);

  const handleQuoteChange = (event) => {
    const { name: fieldName, value } = event.target;
    setQuoteForm((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();
    setQuoteStatus({ type: '', message: '' });

    if (!quoteForm.fullName || !quoteForm.email || !quoteForm.requirements) {
      setQuoteStatus({ type: 'error', message: 'Full name, email, and requirements are required.' });
      return;
    }

    try {
      setQuoteSubmitting(true);
      const productName = product?.Name || product?.name || '';
      const productSku = product?.SKU || product?.sku || product?.id || '';
      await submitQuoteRequest({ ...quoteForm, productName, productSku });
      setQuoteStatus({ type: 'success', message: 'Quote request received. Our team will respond shortly.' });
      setQuoteForm({ fullName: '', email: '', companyName: '', requirements: '' });
    } catch (err) {
      setQuoteStatus({ type: 'error', message: err?.message || 'Unable to submit quote right now.' });
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const openZoom = (src) => {
    if (!src) return;
    setZoomedImage(src);
  };

  const closeZoom = () => setZoomedImage('');

  if (loading) return <section className="mx-auto mt-6 max-w-[1220px]">Loading product...</section>;
  if (error || !product) return <section className="mx-auto mt-6 max-w-[1220px]">{error || 'Product not found'}</section>;

  return (
    <>
      <section className="product-detail-shell mx-auto mt-6 max-w-[1220px] overflow-hidden rounded-md border border-white/10">
        <div className="product-detail-breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              {index < breadcrumbItems.length - 1 ? ' / ' : ''}
            </span>
          ))}
        </div>

        <div className="product-detail-top">
          <div className="product-detail-gallery">
            <div className="product-detail-main-image">
              {activeImage ? (
                <button
                  type="button"
                  className="product-detail-image-button"
                  onClick={() => openZoom(activeImage)}
                  aria-label={`Open larger view for ${name}`}
                >
                  <img src={activeImage} alt={name} />
                  <span className="product-detail-zoom-hint">
                    <ZoomIn size={16} />
                    Click to zoom
                  </span>
                </button>
              ) : (
                <div className="product-detail-no-image">No image available</div>
              )}
            </div>
            {gallery.length ? (
              <div className="product-detail-thumbs">
                {gallery.map((src, index) => (
                  <button
                    key={`${product.id}-thumb-${index + 1}`}
                    type="button"
                    onClick={() => setActiveImage(src)}
                  >
                    <img src={src} alt={`${name} view ${index + 1}`} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-detail-summary">
            <div className="product-status-row">
              <span className="is-new">New</span>
              {product?.inStock ? <span className="in-stock">In Stock</span> : null}
            </div>
            <p className="product-detail-kicker">{category}</p>
            <h1>{name}</h1>
            <h2>Model: {sku}</h2>
            <div className="product-detail-copy-wrap">
              <p
                className="product-detail-copy"
                style={!descExpanded ? {
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                } : {}}
              >
                {description}
              </p>
              {description && description.length > 220 ? (
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="product-detail-read-more"
                >
                  {descExpanded ? 'Read Less ↑' : 'Read More ↓'}
                </button>
              ) : null}
            </div>
            <p className="feature-title">Key Features</p>
            <ul>
              {features.length ? (
                features.map((feature, index) => {
                  const label =
                    typeof feature === 'string'
                      ? feature
                      : feature?.title || feature?.detail || `Feature ${index + 1}`;
                  const detail =
                    typeof feature === 'object' && feature !== null && feature?.detail
                      ? feature.detail
                      : null;
                  const key =
                    typeof feature === 'string'
                      ? feature
                      : feature?.title
                      ? feature.title
                      : `feature-${index}`;

                  return (
                    <li key={key}>
                      {label}
                      {detail ? `: ${detail}` : null}
                    </li>
                  );
                })
              ) : (
                <li>No feature list available.</li>
              )}
            </ul>

            <div className="product-detail-quote">
              <h3>Request Custom Quote</h3>
              <form className="space-y-3" onSubmit={handleQuoteSubmit}>
                <div className="quote-grid">
                  <input
                    name="fullName"
                    value={quoteForm.fullName}
                    onChange={handleQuoteChange}
                    type="text"
                    placeholder="Full Name"
                    required
                  />
                  <input
                    name="email"
                    value={quoteForm.email}
                    onChange={handleQuoteChange}
                    type="email"
                    placeholder="Work Email"
                    required
                  />
                </div>
                <input
                  name="companyName"
                  value={quoteForm.companyName}
                  onChange={handleQuoteChange}
                  type="text"
                  placeholder="Company Name"
                />
                <textarea
                  name="requirements"
                  value={quoteForm.requirements}
                  onChange={handleQuoteChange}
                  rows={3}
                  placeholder="Describe your project requirements..."
                  required
                />
                {quoteStatus.message ? (
                  <p className={`text-sm ${quoteStatus.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                    {quoteStatus.message}
                  </p>
                ) : null}
                <button type="submit" disabled={quoteSubmitting}>
                  {quoteSubmitting ? 'Sending...' : 'Get a Quote'}
                </button>
                <small>Usually responds within 2 hours during business days.</small>
              </form>
            </div>
          </div>
        </div>

        {detailRows.length ? (
          <div className="product-detail-tabs">
            <button type="button" className="active">
              Technical Specifications
            </button>
            <a
              href={datasheet || '#'}
              target={datasheet ? '_blank' : undefined}
              rel={datasheet ? 'noreferrer' : undefined}
              className={!datasheet ? 'disabled' : ''}
            >
              <p className="text-xs ml-5">Downloads &amp; Manuals</p>
            </a>
          </div>
        ) : null}

        <div className={`product-detail-lower ${detailRows.length ? '' : 'no-specs'}`}>
          {detailRows.length ? (
            <div className="product-detail-specs">
              <h3>Detailed Specifications</h3>
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((row) => (
                    <tr key={`${row.parameter}-${row.value}`}>
                      <td>{row.parameter}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <aside className="product-detail-side">
            <div className="download-card">
              <h4>Quick Downloads</h4>
              <a href={datasheet || '#'} target={datasheet ? '_blank' : undefined} rel="noreferrer">
                <FileText size={14} />
                <span>Product Datasheet PDF</span>
                <Download size={14} />
              </a>
            </div>
            <div className="similar-products-card">
              <h4>Similar Products</h4>
              {similarProducts.map((item) => (
                <article key={item.id} className="similar-product-item">
                  <img src={pickBestProductImage(item)} alt={item.Name || item.name} />
                  <div>
                    <p>{item.Name || item.name}</p>
                    <Link className="similar-product-link" href={getProductPath(item)}>
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <div className="product-detail-related">
          <h3>You might also be interested in</h3>
          <div>
            {related.map((item) => (
              <article key={item.id}>
                <img src={pickBestProductImage(item)} alt={item.Name || item.name} />
                <p>{item.Name || item.name}</p>
                <button
                  className="bg-red-500 text-white rounded text-xs p-1"
                  onClick={() => router.push(getProductPath(item))}
                >
                  View Details
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {zoomedImage ? (
        <div
          className="product-detail-zoom-modal ui-modal-backdrop fixed inset-0 z-[120] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image preview`}
          onClick={closeZoom}
        >
          <div
            className="product-detail-zoom-panel relative flex max-h-[92vh] w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/95 p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white transition hover:bg-white/10"
              onClick={closeZoom}
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <div className="flex w-full flex-1 items-center justify-center overflow-auto p-3">
              <img
                src={zoomedImage}
                alt={name}
                className="max-h-[78vh] w-auto max-w-full select-none object-contain"
              />
            </div>
            <div className="pb-2 pt-4 text-center text-sm text-white/70">
              Click outside the image or press close to exit
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ProductDetailPage;
