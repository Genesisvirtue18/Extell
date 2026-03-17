import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, FileText } from 'lucide-react';
import placeholderImage from '../assets/placeholder-tech.svg';
import { getProductById, getProductBySlug, getProducts, submitQuoteRequest } from '../lib/api';
import { getProductPath } from '../lib/productUrl';

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

function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(placeholderImage);

  useEffect(() => {
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
        if (!selected && normalizedSlug) selected = (await getProductById(normalizedSlug).catch(() => null))?.item || null;
        if (!selected) throw new Error('Product not found');

        const relatedItems = (relatedResponse.items || [])
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
    setActiveImage(gallery[0] || '');
  }, [gallery]);

  const handleQuoteChange = (event) => {
    const { name, value } = event.target;
    setQuoteForm((prev) => ({ ...prev, [name]: value }));
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
      await submitQuoteRequest({
        ...quoteForm,
        productName,
        productSku
      });
      setQuoteStatus({ type: 'success', message: 'Quote request received. Our team will respond shortly.' });
      setQuoteForm({ fullName: '', email: '', companyName: '', requirements: '' });
    } catch (err) {
      setQuoteStatus({ type: 'error', message: err?.message || 'Unable to submit quote right now.' });
    } finally {
      setQuoteSubmitting(false);
    }
  };
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

  if (loading) return <section className="mx-auto mt-6 max-w-[1220px]">Loading product...</section>;
  if (error || !product) return <section className="mx-auto mt-6 max-w-[1220px]">{error || 'Product not found'}</section>;

  return (
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
            {activeImage ? <img src={activeImage} alt={name} /> : <div className="product-detail-no-image">No image available</div>}
          </div>
          {gallery.length ? (
            <div className="product-detail-thumbs">
              {gallery.map((src, index) => (
                <button key={`${product.id}-thumb-${index + 1}`} type="button" onClick={() => setActiveImage(src)}>
                  <img src={src} alt={`${name} thumb ${index + 1}`} />
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
          <p className="product-detail-copy">{description}</p>
          <p className="feature-title">Key Features</p>
          <ul>
            {features.length ? features.map((feature) => <li key={feature}>{feature}</li>) : <li>No feature list available.</li>}
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
            Downloads &amp; Manuals
          </a>
          <a
            href={datasheet || '#'}
            target={datasheet ? '_blank' : undefined}
            rel={datasheet ? 'noreferrer' : undefined}
            className={!datasheet ? 'disabled' : ''}
          >
            Certifications
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
                  <Link className="similar-product-link" to={getProductPath(item)}>
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
              <Link className="similar-product-link text-white" to={getProductPath(item)}>
                View Details
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;





