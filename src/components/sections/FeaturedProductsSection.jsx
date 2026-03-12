import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ComparisonModal from '../ui/ComparisonModal';
import { getProducts } from '../../lib/api';
import placeholderImage from '../../assets/placeholder-tech.svg';
import { getProductPath } from '../../lib/productUrl';

function FeaturedProductsSection() {
  const [compareList, setCompareList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState({});
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('extell-wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('extell-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    let mounted = true;

    const getCardImage = (item) => {
      const imageList = Array.isArray(item?.imageList) ? item.imageList : [];
      const scoreImage = (entry) => {
        const value = String(entry || '').toLowerCase();
        let score = 0;
        if (value.includes('/elementor/thumbs/')) score -= 40;
        if (value.includes('front-hero') || value.includes('hero')) score -= 20;
        if (value.includes('iso')) score += 18;
        if (value.includes('side') || value.includes('rear') || value.includes('front')) score += 8;
        return score;
      };
      const sorted = [...imageList].sort((a, b) => scoreImage(b) - scoreImage(a));
      return sorted[0] || item?.heroImage || placeholderImage;
    };

    const normalizeProduct = (item) => {
      const detailRows = Array.isArray(item.detailRows) ? item.detailRows : [];
      const detailSpecs = detailRows.slice(0, 3).reduce((acc, row) => {
        if (row?.parameter && row?.value) acc[row.parameter] = row.value;
        return acc;
      }, {});

      const fallbackSpecs = {
        SKU: item.SKU || item.sku || '-',
        Capacity: detailSpecs.Capacity || '-',
        Topology: detailSpecs.Topology || detailSpecs['Waveform (Batt. Mode)'] || '-'
      };

      return {
        id: item.id,
        sku: item.SKU || item.sku || item.id,
        name: item.Name || item.name || 'Product',
        short: item.descriptionText || item.short || 'Industrial-grade product built for uptime and reliability.',
        inStock: Boolean(item.inStock ?? item['In stock?']),
        specs: Object.keys(detailSpecs).length ? detailSpecs : fallbackSpecs,
        image: getCardImage(item)
      };
    };

    const loadFeatured = async () => {
      try {
        setLoading(true);

        const featuredResponse = await getProducts({
          featured: true,
          published: true,
          sort: 'featured',
          page: 1,
          limit: 4
        });

        let items = featuredResponse.items || [];

        if (items.length < 4) {
          const fallbackResponse = await getProducts({
            published: true,
            sort: 'featured',
            page: 1,
            limit: 8
          });

          const merged = [...items, ...(fallbackResponse.items || [])];
          const unique = [];
          const seen = new Set();
          for (const item of merged) {
            if (!item?.id || seen.has(item.id)) continue;
            seen.add(item.id);
            unique.push(item);
            if (unique.length === 4) break;
          }
          items = unique;
        }

        if (!mounted) return;
        setProducts(items.map(normalizeProduct));
      } catch {
        if (!mounted) return;
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  const onCompare = (product) => {
    setCompareList((prev) => {
      if (prev.find((item) => item.id === product.id)) return prev;
      return [...prev, product].slice(-3);
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const displayProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <section className="ui-section relative py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(229,57,53,0.12),transparent_36%)]" />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Featured" title="High-demand Products" subtitle="Flagship products optimized for uptime, scale, and compliance." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading
            ? [...Array(4)].map((_, idx) => (
                <div key={`feature-skeleton-${idx}`} className="ui-surface-1 h-[420px] animate-pulse rounded-xl" />
              ))
            : null}
          {!loading && displayProducts.length
            ? displayProducts.map((product) => (
                <article key={product.id} className="catalog-card">
                  <div className="catalog-card-tag">{product.inStock ? 'IN STOCK' : 'PRODUCT'}</div>
                  <button
                    type="button"
                    className={`catalog-fav ${wishlist.includes(product.id) ? 'active' : ''}`}
                    aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart size={14} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                  <div className="catalog-image-wrap">
                    <img
                      src={brokenImages[product.id] ? placeholderImage : product.image || placeholderImage}
                      alt={product.name}
                      loading="lazy"
                      onError={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [product.id]: true
                        }))
                      }
                    />
                  </div>
                  <p className="catalog-sku">{product.sku}</p>
                  <h3>{product.name}</h3>
                  <p className="catalog-short">{product.short}</p>
                  <div className="catalog-spec-grid">
                    {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                      <div key={`${product.id}-${key}`}>
                        <span>{key}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="catalog-card-actions">
                    <Link to={getProductPath(product)}>VIEW SPECS</Link>
                    <button type="button" onClick={() => onCompare(product)}>
                      COMPARE
                    </button>
                  </div>
                </article>
              ))
            : null}
          {!loading && !displayProducts.length ? (
            <div className="ui-surface-1 rounded-xl p-6 text-sm ui-text-muted">
              No featured products available right now.
            </div>
          ) : null}
        </div>
      </div>
      <ComparisonModal items={compareList} open={compareList.length > 1} onClose={() => setCompareList([])} />
    </section>
  );
}

export default FeaturedProductsSection;

