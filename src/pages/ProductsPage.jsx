'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Heart, SlidersHorizontal, Search, X, ChevronRight } from 'lucide-react';

import ComparisonModal from '../components/ui/ComparisonModal';
import { getProducts } from '../lib/api';
import { getProductPath } from '../lib/productUrl';

const placeholderImage = '/assets/placeholder-tech.svg';

const slugifyValue = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const parseCategoryPath = (rawValue) =>
  String(rawValue || '')
    .split('>')
    .map((part) => part.split(',')[0].trim())
    .filter(Boolean);

function SkeletonCard() {
  return (
    <div className="ui-surface-1 animate-pulse overflow-hidden rounded-2xl">
      <div className="aspect-square bg-slate-200 dark:bg-white/5" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-16 rounded bg-slate-200 dark:bg-white/5" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/5" />
        <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-white/5" />
        <div className="mt-3 h-8 w-full rounded-lg bg-slate-200 dark:bg-white/5" />
      </div>
    </div>
  );
}

function ProductsPage({ initialProducts = [], initialCategories = [], initialPagination }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [compareList, setCompareList] = useState([]);
  const [brokenImages, setBrokenImages] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'featured');
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [types, setTypes] = useState([]);
  const [pagination, setPagination] = useState(
    initialPagination || { total: 0, page: 1, totalPages: 1, limit: 12 }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('extell-wishlist');
      setWishlist(raw ? JSON.parse(raw) : []);
    } catch {
      setWishlist([]);
    }
  }, []);

  const selectedCategory = searchParams?.get('category') || '';
  const selectedSubCategory = searchParams?.get('subCategory') || '';
  const selectedType = searchParams?.get('type') || '';
  const inStock = searchParams?.get('inStock') === 'true';
  const featured = searchParams?.get('featured') === 'true';
  const published = searchParams?.get('published') === 'true';

  const updateSearchParams = (params) => {
    router.push(`${pathname}?${params.toString()}`);
  };

  const syncParam = (key, value) => {
    const next = new URLSearchParams(searchParams?.toString());
    if (value === '' || value === false || value === undefined || value === null) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== 'page') next.set('page', '1');
    updateSearchParams(next);
  };

  const resetAllFilters = () => {
    setSortBy('featured');
    setQuery('');
    const params = new URLSearchParams();
    params.set('sort', 'featured');
    updateSearchParams(params);
  };

  useEffect(() => {
    const timeout = setTimeout(() => { syncParam('q', query.trim()); }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams?.toString());
    next.set('sort', sortBy);
    updateSearchParams(next);
  }, [sortBy]);

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {
          q: searchParams?.get('q') || '',
          category: selectedCategory,
          type: selectedType,
          inStock: inStock ? true : '',
          featured: featured ? true : '',
          published: published ? true : '',
          sort: searchParams?.get('sort') || 'featured',
          page: Number(searchParams?.get('page') || 1),
          limit: 12,
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
    return () => { mounted = false; };
  }, [searchParams?.toString()]);

  useEffect(() => {
    localStorage.setItem('extell-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
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
        const categoryPath = parseCategoryPath(
          product.Categories || product.topCategory || product.category || ''
        );
        const topLevel = categoryPath[0] || product.topCategory || product.category || '';
        const subCategory = categoryPath[1] || '';
        return {
          ...product,
          cardId: product.id,
          sku: product.SKU || product.sku || product.id,
          name: product.Name || product.name || 'Unnamed Product',
          short: product.descriptionText || product.short || '',
          tag: product.isFeatured ? 'FEATURED' : product.inStock ? 'IN STOCK' : 'PRODUCT',
          specs: Object.fromEntries(specEntries),
          image: getCardImage(product),
          categoryPath,
          topLevel,
          subCategory,
          subCategorySlug: slugifyValue(subCategory),
        };
      }),
    [products]
  );

  const subCategoryOptions = useMemo(() => {
    const optionMap = new Map();
    cards.forEach((card) => {
      if (!card.subCategory) return;
      optionMap.set(card.subCategorySlug, card.subCategory);
    });
    return Array.from(optionMap.entries()).map(([slug, name]) => ({ slug, name }));
  }, [cards]);

  const visibleCards = useMemo(
    () =>
      selectedSubCategory
        ? cards.filter((card) => card.subCategorySlug === selectedSubCategory)
        : cards,
    [cards, selectedSubCategory]
  );

  useEffect(() => {
    if (!selectedSubCategory) return;
    const hasActiveSubCategory = subCategoryOptions.some((o) => o.slug === selectedSubCategory);
    if (!hasActiveSubCategory) syncParam('subCategory', '');
  }, [selectedSubCategory, subCategoryOptions]);

  useEffect(() => {
    if (!selectedSubCategory) return;
    const pageFromQuery = Number(searchParams?.get('page') || 1);
    if (pageFromQuery > 1) syncParam('page', 1);
  }, [selectedSubCategory, searchParams]);

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const currentPage = Math.min(totalPages, Math.max(1, pagination.page || 1));

  const pageItems = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    if (currentPage >= totalPages - 3)
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  }, [currentPage, totalPages]);

  const activeFilterCount = [selectedCategory, selectedType, selectedSubCategory, inStock, featured, published].filter(Boolean).length;

  /* ─── Sidebar JSX (shared between desktop + mobile drawer) ─── */
  const SidebarContent = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest ui-text">
          <SlidersHorizontal size={13} className="text-[#ed2125]" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-[#ed2125] px-1.5 py-0.5 text-[0.55rem] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={resetAllFilters}
          className="text-[0.68rem] font-medium text-[#ed2125] hover:underline"
        >
          Reset all
        </button>
      </div>

      {/* Category */}
      <div className="border-t ui-border py-4">
        <p className="mb-3 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-[#ed2125]">Category</p>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex cursor-pointer items-center gap-2.5 group">
              <input
                type="radio"
                name="category-filter"
                checked={selectedCategory === cat.slug}
                onChange={() => syncParam('category', cat.slug)}
                className="h-3.5 w-3.5 accent-[#ed2125]"
              />
              <span className="text-xs leading-snug ui-text-muted group-hover:ui-text transition-colors">{cat.name}</span>
            </label>
          ))}
          {selectedCategory && (
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="radio" name="category-filter" checked={false} onChange={() => syncParam('category', '')} className="h-3.5 w-3.5 accent-[#ed2125]" />
              <span className="text-xs text-[#ed2125]">All Categories</span>
            </label>
          )}
        </div>
      </div>

      {/* Type */}
      {types.length > 0 && (
        <div className="border-t ui-border py-4">
          <p className="mb-3 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-[#ed2125]">Type</p>
          <div className="space-y-2.5">
            {types.map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-2.5 group">
                <input type="radio" name="type-filter" checked={selectedType === type} onChange={() => syncParam('type', type)} className="h-3.5 w-3.5 accent-[#ed2125]" />
                <span className="text-xs ui-text-muted group-hover:ui-text transition-colors">{type}</span>
              </label>
            ))}
            {selectedType && (
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="radio" name="type-filter" checked={false} onChange={() => syncParam('type', '')} className="h-3.5 w-3.5 accent-[#ed2125]" />
                <span className="text-xs text-[#ed2125]">All Types</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Subcategory */}
      {subCategoryOptions.length > 0 && (
        <div className="border-t ui-border py-4">
          <p className="mb-3 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-[#ed2125]">Subcategory</p>
          <div className="space-y-2.5">
            {subCategoryOptions.map((sub) => (
              <label key={sub.slug} className="flex cursor-pointer items-center gap-2.5 group">
                <input type="radio" name="subcategory-filter" checked={selectedSubCategory === sub.slug} onChange={() => syncParam('subCategory', sub.slug)} className="h-3.5 w-3.5 accent-[#ed2125]" />
                <span className="text-xs ui-text-muted group-hover:ui-text transition-colors">{sub.name}</span>
              </label>
            ))}
            {selectedSubCategory && (
              <label className="flex cursor-pointer items-center gap-2.5">
                <input type="radio" name="subcategory-filter" checked={false} onChange={() => syncParam('subCategory', '')} className="h-3.5 w-3.5 accent-[#ed2125]" />
                <span className="text-xs text-[#ed2125]">All Subcategories</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="border-t ui-border py-4">
        <p className="mb-3 text-[0.63rem] font-bold uppercase tracking-[0.12em] text-[#ed2125]">Status</p>
        <div className="space-y-2.5">
          {[
            { label: 'In Stock', param: 'inStock', checked: inStock },
            { label: 'Featured', param: 'featured', checked: featured },
            { label: 'Published', param: 'published', checked: published },
          ].map(({ label, param, checked }) => (
            <label key={param} className="flex cursor-pointer items-center gap-2.5 group">
              <input type="checkbox" checked={checked} onChange={(e) => syncParam(param, e.target.checked)} className="h-3.5 w-3.5 accent-[#ed2125] rounded" />
              <span className="text-xs ui-text-muted group-hover:ui-text transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="ui-bg-soft min-h-screen">

      {/* ── Page header ── */}
      <div className="border-b ui-border bg-white dark:bg-transparent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1 text-[0.7rem] ui-text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ed2125] transition-colors">Home</Link>
            <ChevronRight size={10} />
            <Link href="/products" className="hover:text-[#ed2125] transition-colors">Products</Link>
            {selectedCategory && (
              <>
                <ChevronRight size={10} />
                <span className="ui-text font-medium">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
            {selectedSubCategory && (
              <>
                <ChevronRight size={10} />
                <span className="ui-text font-medium">
                  {subCategoryOptions.find((c) => c.slug === selectedSubCategory)?.name || selectedSubCategory}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight ui-text sm:text-3xl">
                {selectedCategory
                  ? (categories.find((c) => c.slug === selectedCategory)?.name || 'Products')
                  : 'UPS, Fiber & ICT Products'}
              </h1>
              <p className="mt-1 text-sm ui-text-muted">
                Enterprise power electronics and ICT infrastructure product catalog.
              </p>
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs ui-text-muted">
                <span className="font-medium">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ui-input rounded-lg border px-3 py-1.5 text-xs font-medium ui-text focus:outline-none focus:ring-2 focus:ring-[#ed2125]/30"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="lg:flex lg:gap-8 lg:items-start">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden w-[230px] shrink-0 lg:block">
            <div className="ui-surface-1 sticky top-24 rounded-2xl px-4 pb-4 pt-4">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Content area ── */}
          <div className="min-w-0 flex-1">

            {/* Toolbar: search + mobile filter toggle + result count */}
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {/* Mobile filter button */}
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border ui-border px-3 py-2 text-xs font-semibold ui-text transition hover:border-[#ed2125] hover:text-[#ed2125] lg:hidden"
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-[#ed2125] px-1.5 text-[0.55rem] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Search */}
              <div className="relative flex-1" style={{ minWidth: 180 }}>
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 ui-text-muted pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by model, name, SKU…"
                  aria-label="Search products"
                  className="ui-input w-full rounded-xl border pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ed2125]/30"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 ui-text-muted hover:ui-text">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Result count + compare */}
              <div className="flex items-center gap-3 text-xs ui-text-muted whitespace-nowrap">
                <span>{selectedSubCategory ? visibleCards.length : pagination.total} results</span>
                {compareList.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="rounded-full bg-[#ed2125] px-2 py-0.5 text-[0.65rem] font-bold text-white">
                      {compareList.length} comparing
                    </span>
                    <button type="button" onClick={() => setCompareList([])} className="hover:text-[#ed2125] transition-colors">
                      Clear
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <div className="rounded-2xl border ui-border p-12 text-center">
                <p className="text-sm ui-text-muted">{error}</p>
                <button type="button" onClick={resetAllFilters} className="mt-4 text-sm font-semibold text-[#ed2125] hover:underline">
                  Reset filters
                </button>
              </div>
            ) : visibleCards.length === 0 ? (
              <div className="rounded-2xl border ui-border p-16 text-center">
                <p className="text-sm font-medium ui-text">No products found</p>
                <p className="mt-1 text-xs ui-text-muted">Try adjusting your filters or search term.</p>
                <button type="button" onClick={resetAllFilters} className="mt-4 text-sm font-semibold text-[#ed2125] hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {visibleCards.map((product) => {
                  const productKey = product.id || product.cardId || product.sku;
                  const isWishlisted = wishlist.includes(productKey);
                  const hasBrokenImage = brokenImages[productKey];
                  const tagColor = product.tag === 'FEATURED'
                    ? { bg: '#ed2125', text: '#fff' }
                    : product.tag === 'IN STOCK'
                    ? { bg: '#16a34a', text: '#fff' }
                    : { bg: '#64748b', text: '#fff' };

                  return (
                    <article
                      key={product.cardId}
                      className="ui-surface-1 group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-lg hover:border-[#ed2125]/25"
                    >
                      {/* Image zone */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50/80 dark:bg-white/[0.02]">
                        {/* Tag badge */}
                        <span
                          className="absolute left-2.5 top-2.5 z-10 rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider"
                          style={{ background: tagColor.bg, color: tagColor.text }}
                        >
                          {product.tag}
                        </span>

                        {/* Wishlist heart */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(productKey)}
                          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 active:scale-95"
                        >
                          <Heart
                            size={13}
                            style={{ color: isWishlisted ? '#ed2125' : '#94a3b8' }}
                            fill={isWishlisted ? '#ed2125' : 'none'}
                          />
                        </button>

                        {/* Product image */}
                        <img
                          src={hasBrokenImage ? placeholderImage : product.image || placeholderImage}
                          alt={product.name}
                          loading="lazy"
                          onError={() => setBrokenImages((prev) => ({ ...prev, [productKey]: true }))}
                          className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </div>

                      {/* Card body */}
                      <div className="flex flex-1 flex-col p-3.5">
                        {/* SKU + breadcrumb */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-wider text-[#ed2125]">
                            {product.sku}
                          </span>
                        </div>
                        {product.subCategory ? (
                          <p className="mt-0.5 text-[0.58rem] ui-text-muted">
                            {product.topLevel} › {product.subCategory}
                          </p>
                        ) : null}

                        {/* Name */}
                        <h3 className="mt-2 line-clamp-2 text-[0.82rem] font-semibold leading-snug ui-text">
                          {product.name}
                        </h3>

                        {/* Short description */}
                        {product.short ? (
                          <p className="mt-1 line-clamp-2 text-[0.67rem] leading-relaxed ui-text-muted">
                            {product.short}
                          </p>
                        ) : null}

                        {/* Spec table */}
                        {Object.keys(product.specs).length > 0 && (
                          <div className="mt-3 flex-1 overflow-hidden rounded-xl border ui-border">
                            {Object.entries(product.specs).map(([key, value], idx) => (
                              <div
                                key={`${product.cardId}-${key}`}
                                className={`flex items-start justify-between gap-2 px-2.5 py-1.5 ${idx > 0 ? 'border-t ui-border' : ''}`}
                              >
                                <span className="shrink-0 text-[0.6rem] ui-text-muted">{key}</span>
                                <strong className="text-right text-[0.6rem] font-semibold ui-text">{value}</strong>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CTA buttons */}
                        <div className="mt-3 flex gap-2">
                          <Link
                            href={getProductPath(product)}
                            className="flex-1 rounded-xl bg-[#ed2125] py-2 text-center text-[0.7rem] font-semibold text-white transition hover:bg-[#d91f23] active:scale-[0.98]"
                          >
                            View Specs
                          </Link>
                          <button
                            type="button"
                            title="Add to compare"
                            onClick={() =>
                              setCompareList((prev) =>
                                [...prev.filter((p) => p.id !== productKey), { ...product, id: productKey }].slice(-3)
                              )
                            }
                            className="rounded-xl border ui-border px-3 py-2 text-[0.7rem] font-semibold ui-text-muted transition hover:border-[#ed2125] hover:text-[#ed2125] active:scale-[0.98]"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !selectedSubCategory && !loading && (
              <div className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
                {pageItems.map((item, index) =>
                  item === 'ellipsis' ? (
                    <span key={`e-${index}`} className="flex h-9 w-9 items-center justify-center text-xs ui-text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={`p-${item}`}
                      type="button"
                      aria-label={`Page ${item}`}
                      aria-current={item === currentPage ? 'page' : undefined}
                      onClick={() => syncParam('page', item)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition ${
                        item === currentPage
                          ? 'bg-[#ed2125] text-white shadow-sm'
                          : 'ui-surface-1 ui-text hover:border-[#ed2125]/50 hover:text-[#ed2125]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl ui-surface-1 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold ui-text">Filters</span>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rounded-lg p-1.5 ui-text-muted hover:ui-text transition-colors"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
            <button
              type="button"
              onClick={() => setShowMobileFilters(false)}
              className="mt-4 w-full rounded-xl bg-[#ed2125] py-2.5 text-sm font-semibold text-white transition hover:bg-[#d91f23]"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      <ComparisonModal items={compareList} open={compareList.length > 1} onClose={() => setCompareList([])} />
    </div>
  );
}

export default ProductsPage;
