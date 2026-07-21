'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { getProducts } from '../../lib/api';
import { categories as siteCategories } from '../../data/siteData';
import { getProductPath } from '../../lib/productUrl';
import { pickBestProductImage } from '../../lib/productSeo';

const PLACEHOLDER = '/assets/placeholder-tech.svg';
const RED = '#ed2125';

export default function CategoryProductsSection() {
  const [counts, setCounts] = useState({});
  const [countsReady, setCountsReady] = useState(false);
  const [activeSlug, setActiveSlug] = useState(null);
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [broken, setBroken] = useState({});

  // Fetch product count for every category in parallel
  useEffect(() => {
    let alive = true;
    Promise.allSettled(
      siteCategories.map((cat) =>
        getProducts({ category: cat.slug, limit: 1, page: 1 })
          .then((res) => ({
            slug: cat.slug,
            count:
              res?.pagination?.total ??
              res?.total ??
              (Array.isArray(res?.items) ? res.items.length : 0),
          }))
          .catch(() => ({ slug: cat.slug, count: 0 }))
      )
    ).then((results) => {
      if (!alive) return;
      const map = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') map[r.value.slug] = r.value.count;
      });
      setCounts(map);
      setCountsReady(true);

      const withProducts = siteCategories.filter((c) => (map[c.slug] || 0) > 0);
      const first = withProducts[0] || siteCategories[0];
      setActiveSlug(first?.slug || null);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Fetch products when active tab changes
  useEffect(() => {
    if (!activeSlug || cache[activeSlug] !== undefined) return;
    let alive = true;
    setLoading(true);
    getProducts({ category: activeSlug, limit: 4, page: 1 })
      .then((res) => {
        if (!alive) return;
        setCache((prev) => ({ ...prev, [activeSlug]: (res?.items || []).slice(0, 4) }));
      })
      .catch(() => {
        if (alive) setCache((prev) => ({ ...prev, [activeSlug]: [] }));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [activeSlug]);

  // Only show categories that have products; fallback to all if API returns nothing
  const withProducts = countsReady
    ? siteCategories.filter((c) => (counts[c.slug] || 0) > 0)
    : [];
  const visibleTabs = withProducts.length > 0 ? withProducts : (countsReady ? siteCategories : siteCategories);

  const activeCat = visibleTabs.find((t) => t.slug === activeSlug) || visibleTabs[0];
  const products = activeSlug ? cache[activeSlug] || [] : [];
  const isLoading = loading || !countsReady || !activeSlug;

  return (
    <section className="ui-section py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* Tab pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {visibleTabs.map((tab) => {
            const isActive = tab.slug === activeSlug;
            const count = counts[tab.slug] || 0;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveSlug(tab.slug)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 9999,
                  border: `2px solid ${isActive ? RED : 'var(--ui-border-subtle)'}`,
                  background: isActive ? RED : 'transparent',
                  color: isActive ? '#fff' : 'var(--ui-text)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  letterSpacing: '0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {tab.name}
                {countsReady && count > 0 && (
                  <span
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : `${RED}18`,
                      color: isActive ? '#fff' : RED,
                      borderRadius: 9999,
                      fontSize: '0.63rem',
                      fontWeight: 700,
                      padding: '0.08rem 0.42rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="cat-section-body">

          {/* Left info panel */}
          <div className="cat-section-left">
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED, marginBottom: '0.5rem' }}>
              {activeCat?.name}
            </p>
            <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.9rem' }}>
              Enterprise-grade<br />{activeCat?.name}
            </h2>
            <p style={{ fontSize: '0.83rem', lineHeight: 1.65, color: 'var(--ui-text-muted)', marginBottom: '1.3rem' }}>
             Procured from top-tier suppliers, validated for high-performance deployments, and sustained by ExTell's worldwide service ecosystem.
            </p>
            <Link
              href={`/category/${activeSlug || ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', fontWeight: 700, color: RED, textDecoration: 'none' }}
            >
              Explore all <ArrowRight size={13} />
            </Link>
          </div>

          {/* Product cards */}
          <div className="cat-section-cards">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="ui-surface-1"
                    style={{ borderRadius: 14, height: 270, animation: 'cat-pulse 1.4s ease-in-out infinite' }}
                  />
                ))
              : products.length > 0
              ? products.map((product) => {
                  const name = product.Name || product.name || 'Product';
                  const sku = product.SKU || product.sku || '';
                  const cat = product.topCategory || activeCat?.name || '';
                  const imgSrc = broken[product.id] ? PLACEHOLDER : pickBestProductImage(product, PLACEHOLDER);
                  return (
                    <Link
                      key={product.id || product._id}
                      href={getProductPath(product)}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <article
                        className="ui-surface-1 cat-card"
                        style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
                      >
                        <div style={{ background: 'var(--ui-surface-2)', height: 155, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
                          <img
                            src={imgSrc}
                            alt={name}
                            onError={() => setBroken((prev) => ({ ...prev, [product.id]: true }))}
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ padding: '0.75rem 0.9rem 0.9rem' }}>
                          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: RED, marginBottom: '0.25rem' }}>{cat}</p>
                          <p style={{ fontSize: '0.83rem', fontWeight: 600, lineHeight: 1.35, marginBottom: '0.3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{name}</p>
                          {sku && (
                            <p style={{ fontSize: '0.7rem', color: 'var(--ui-text-muted)', marginTop: '0.2rem' }}>SKU: {sku}</p>
                          )}
                        </div>
                      </article>
                    </Link>
                  );
                })
              : [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="ui-surface-1"
                    style={{ borderRadius: 14, height: 270, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '1rem' }}
                  >
                    <span style={{ width: 40, height: 40, borderRadius: '50%', background: `${RED}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={18} color={RED} />
                    </span>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ui-text)', margin: 0 }}>Coming Soon</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--ui-text-muted)', margin: 0, textAlign: 'center' }}>
                      New products launching soon
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <style>{`
        .cat-section-body { display: flex; gap: 2.5rem; align-items: flex-start; }
        .cat-section-left { flex-shrink: 0; width: 210px; }
        .cat-section-cards { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .cat-card { transition: box-shadow 0.2s, transform 0.15s; }
        .cat-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.12); transform: translateY(-2px); }
        @keyframes cat-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        @media (max-width: 1024px) {
          .cat-section-body { flex-direction: column; }
          .cat-section-left { width: 100%; }
          .cat-section-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .cat-section-cards { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </section>
  );
}
