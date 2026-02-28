import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, SlidersHorizontal } from 'lucide-react';
import ComparisonModal from '../components/ui/ComparisonModal';
import placeholderImage from '../assets/placeholder-tech.svg';
import { getProducts } from '../lib/api';
import { getProductPath } from '../lib/productUrl';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [compareList, setCompareList] = useState([]);
  const [brokenImages, setBrokenImages] = useState({});
  const [wishlist, setWishlist] = useState(() => {
    try {
      const raw = localStorage.getItem('extell-wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedCategory = searchParams.get('category') || '';
  const selectedType = searchParams.get('type') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const featured = searchParams.get('featured') === 'true';
  const published = searchParams.get('published') === 'true';

  const syncParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === false || value === undefined || value === null) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== 'page') {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const resetAllFilters = () => {
    setSortBy('featured');
    setQuery('');
    setSearchParams(new URLSearchParams({ sort: 'featured' }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      syncParam('q', query.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', sortBy);
    setSearchParams(next, { replace: true });
  }, [sortBy]);

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {
          q: searchParams.get('q') || '',
          category: selectedCategory,
          type: selectedType,
          inStock: inStock ? true : '',
          featured: featured ? true : '',
          published: published ? true : '',
          sort: searchParams.get('sort') || 'featured',
          page: Number(searchParams.get('page') || 1),
          limit: 12
        };
        const response = await getProducts(params);
        if (!mounted) return;
        setProducts(response.items || []);
        setCategories(response.filters?.categories || []);
        setTypes(response.filters?.types || []);
        setPagination(response.pagination || { total: 0, page: 1, totalPages: 1, limit: 12 });
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Could not load products');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      mounted = false;
    };
  }, [searchParams.toString()]);

  useEffect(() => {
    localStorage.setItem('extell-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const getCardImage = (product) => {
    const imageList = Array.isArray(product.imageList) ? product.imageList : [];
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
    return sorted[0] || product.heroImage || placeholderImage;
  };

  const cards = useMemo(
    () =>
      products.map((product) => {
        const specEntries = Array.isArray(product.detailRows)
          ? product.detailRows.slice(0, 4).map((row) => [row.parameter, row.value])
          : Object.entries(product.specs || {});
        return {
          ...product,
          cardId: product.id,
          sku: product.SKU || product.sku || product.id,
          name: product.Name || product.name || 'Unnamed Product',
          short: product.descriptionText || product.short || '',
          tag: product.isFeatured ? 'FEATURED' : product.inStock ? 'IN STOCK' : 'PRODUCT',
          specs: Object.fromEntries(specEntries),
          image: getCardImage(product)
        };
      }),
    [products]
  );

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const currentPage = Math.min(totalPages, Math.max(1, pagination.page || 1));

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  return (
    <section className="catalog-shell mx-auto mt-6 max-w-[1220px] overflow-hidden rounded-md border border-white/10">
      <div className="catalog-grid">
        <aside className="catalog-filters">
          <div className="catalog-filter-header">
            <SlidersHorizontal size={14} />
            <span>FILTERS</span>
            <button type="button" onClick={resetAllFilters}>
              Reset All
            </button>
          </div>

          <div className="catalog-filter-group">
            <h3>CATEGORY</h3>
            {categories.map((category) => (
              <label key={category.slug}>
                <input
                  type="radio"
                  name="category-filter"
                  checked={selectedCategory === category.slug}
                  onChange={() => syncParam('category', category.slug)}
                />
                <span>{category.name}</span>
              </label>
            ))}
            {selectedCategory ? (
              <label>
                <input type="radio" name="category-filter" checked={false} onChange={() => syncParam('category', '')} />
                <span>All Categories</span>
              </label>
            ) : null}
          </div>

          <div className="catalog-filter-group">
            <h3>TYPE</h3>
            {types.map((type) => (
              <label key={type}>
                <input type="radio" name="type-filter" checked={selectedType === type} onChange={() => syncParam('type', type)} />
                <span>{type}</span>
              </label>
            ))}
            {selectedType ? (
              <label>
                <input type="radio" name="type-filter" checked={false} onChange={() => syncParam('type', '')} />
                <span>All Types</span>
              </label>
            ) : null}
          </div>

          <div className="catalog-filter-group">
            <h3>STATUS</h3>
            <label>
              <input type="checkbox" checked={inStock} onChange={(e) => syncParam('inStock', e.target.checked)} />
              <span>In Stock</span>
            </label>
            <label>
              <input type="checkbox" checked={featured} onChange={(e) => syncParam('featured', e.target.checked)} />
              <span>Featured</span>
            </label>
            <label>
              <input type="checkbox" checked={published} onChange={(e) => syncParam('published', e.target.checked)} />
              <span>Published</span>
            </label>
          </div>
        </aside>

        <div className="catalog-content">
          <div className="catalog-crumb">
            HOME &gt; PRODUCTS
            {selectedCategory ? ` > ${categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}` : ''}
          </div>
          <div className="catalog-title-row">
            <div>
              <h1>INDUSTRIAL POWER SOLUTIONS</h1>
              <p>Live catalog connected to your products database.</p>
            </div>
            <div className="catalog-toolbar">
              <label>
                <span>Sort by</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="catalog-actions">
            <div className="catalog-compare-pill">
              {compareList.length} ITEMS SELECTED FOR COMPARISON | {pagination.total} RESULTS
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by model, name, SKU..."
              aria-label="Search products"
            />
            <button type="button" onClick={() => setCompareList([])}>
              CLEAR COMPARE
            </button>
          </div>

          {loading ? <p>Loading products...</p> : null}
          {error ? <p>{error}</p> : null}
          {!loading && !error ? (
            <div className="catalog-cards">
              {cards.map((product) => {
                const productKey = product.id || product.cardId || product.sku;
                const isWishlisted = wishlist.includes(productKey);
                const hasBrokenImage = brokenImages[productKey];

                return (
                  <article key={product.cardId} className="catalog-card">
                    <div className="catalog-card-tag">{product.tag}</div>
                    <button
                      type="button"
                      className={`catalog-fav ${isWishlisted ? 'active' : ''}`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      onClick={() => toggleWishlist(productKey)}
                    >
                      <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                    <div className="catalog-image-wrap">
                      <img
                        src={hasBrokenImage ? placeholderImage : product.image || placeholderImage}
                        alt={product.name}
                        loading="lazy"
                        onError={() =>
                          setBrokenImages((prev) => ({
                            ...prev,
                            [productKey]: true
                          }))
                        }
                      />
                    </div>
                    <p className="catalog-sku">{product.sku}</p>
                    <h3>{product.name}</h3>
                    <p className="catalog-short">{product.short}</p>
                    <div className="catalog-spec-grid">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={`${product.cardId}-${key}`}>
                          <span>{key}</span>
                          <strong>{value}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="catalog-card-actions">
                      <Link to={getProductPath(product)}>VIEW SPECS</Link>
                      <button
                        type="button"
                        onClick={() =>
                          setCompareList((prev) => [...prev.filter((p) => p.id !== productKey), { ...product, id: productKey }].slice(-3))
                        }
                      >
                        COMPARE
                      </button>
                    </div>
                  </article>
                );
              })}
              {!cards.length ? <p>No products found for the selected filters.</p> : null}
            </div>
          ) : null}

          {totalPages > 1 ? (
            <div className="catalog-pagination" aria-label="Pagination">
              {pageItems.map((item, index) =>
                item === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="ellipsis" aria-hidden="true">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${item}`}
                    type="button"
                    className={item === currentPage ? 'active' : ''}
                    aria-label={`Go to page ${item}`}
                    aria-current={item === currentPage ? 'page' : undefined}
                    onClick={() => syncParam('page', item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
      <ComparisonModal items={compareList} open={compareList.length > 1} onClose={() => setCompareList([])} />
    </section>
  );
}

export default ProductsPage;
