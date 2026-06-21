'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '../../lib/api';
import { categories as siteCategories } from '../../data/siteData';

const PLACEHOLDER = '/assets/placeholder-tech.svg';
const RED = '#ed2125';

const TABS = siteCategories; // [{ name, slug }]

function getBestImage(item) {
  const list = Array.isArray(item?.imageList) ? item.imageList : [];
  const candidates = [item?.heroImage, ...list].filter(Boolean);
  if (!candidates.length) return PLACEHOLDER;
  const score = (src) => {
    const v = String(src).toLowerCase();
    let s = 0;
    if (v.includes('/elementor/thumbs/')) s -= 40;
    if (v.includes('hero')) s -= 20;
    if (v.includes('iso')) s += 18;
    if (v.includes('side') || v.includes('rear') || v.includes('front')) s += 8;
    return s;
  };
  return [...candidates].sort((a, b) => score(b) - score(a))[0] || PLACEHOLDER;
}

function productPath(p) {
  const param = p?.slug || p?.id || '';
  return param ? `/product/${param}` : '/products';
}

export default function CategoryProductsSection() {
  const [activeSlug, setActiveSlug] = useState(TABS[2]?.slug || TABS[0]?.slug); // default UPS Systems
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [broken, setBroken] = useState({});

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
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [activeSlug]);

  const activeCat = TABS.find((t) => t.slug === activeSlug);
  const products = cache[activeSlug] || [];

  return (
    <section className="ui-section py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── Tab pills ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {TABS.map((tab) => {
            const isActive = tab.slug === activeSlug;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => setActiveSlug(tab.slug)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: 9999,
                  border: `2px solid ${isActive ? RED : 'var(--ui-border-subtle)'}`,
                  background: isActive ? RED : 'transparent',
                  color: isActive ? '#fff' : 'var(--ui-text)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  letterSpacing: '0.01em',
                }}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* ── Body: left panel + cards ──────────────────────────────────── */}
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
              Sourced from leading manufacturers, tested for critical environments, and backed by ExTell's global support network.
            </p>
            <Link
              href={`/category/${activeSlug}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.83rem', fontWeight: 700, color: RED, textDecoration: 'none' }}
            >
              Explore all <ArrowRight size={13} />
            </Link>
          </div>

          {/* Product cards */}
          <div className="cat-section-cards">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="ui-surface-1"
                    style={{ borderRadius: 14, height: 270, animation: 'cat-pulse 1.4s ease-in-out infinite' }}
                  />
                ))
              : products.length
              ? products.map((product) => {
                  const name = product.Name || product.name || 'Product';
                  const sku = product.SKU || product.sku || '';
                  const cat = product.topCategory || activeCat?.name || '';
                  const imgSrc = broken[product.id] ? PLACEHOLDER : getBestImage(product);
                  return (
                    <Link
                      key={product.id || product._id}
                      href={productPath(product)}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      <article
                        className="ui-surface-1 cat-card"
                        style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}
                      >
                        {/* Image area */}
                        <div style={{ background: 'var(--ui-surface-2)', height: 155, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
                          <img
                            src={imgSrc}
                            alt={name}
                            onError={() => setBroken((prev) => ({ ...prev, [product.id]: true }))}
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        {/* Info */}
                        <div style={{ padding: '0.75rem 0.9rem 0.9rem' }}>
                          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: RED, marginBottom: '0.25rem' }}>
                            {cat}
                          </p>
                          <p style={{ fontSize: '0.83rem', fontWeight: 600, lineHeight: 1.35, marginBottom: '0.3rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {name}
                          </p>
                          {sku && (
                            <p style={{ fontSize: '0.7rem', color: 'var(--ui-text-muted)', marginTop: '0.2rem' }}>
                              SKU: {sku}
                            </p>
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
                    style={{ borderRadius: 14, height: 270, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--ui-text-muted)' }}
                  >
                    No products
                  </div>
                ))}
          </div>
        </div>
      </div>

      <style>{`
        .cat-section-body {
          display: flex;
          gap: 2.5rem;
          align-items: flex-start;
        }
        .cat-section-left {
          flex-shrink: 0;
          width: 210px;
        }
        .cat-section-cards {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .cat-card {
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .cat-card:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        @keyframes cat-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
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
