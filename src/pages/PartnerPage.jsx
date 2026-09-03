'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, CheckCircle2, Globe2, Mail, MapPin, Package, Phone, Users2 } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { loadPartnerDirectory, resolvePartnerProducts, slugify } from '../lib/partnerDirectory';
import { fetchAdminProducts, fetchPartners } from '../admin/services/api';

const toCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} aria-hidden="true" />
);

const PartnerPageSkeleton = () => (
  <div className="mt-10 space-y-6" aria-label="Loading partners" role="status">
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`stat-skeleton-${index}`} className="rounded-2xl border border-[#e6e6e6] bg-white p-5 shadow-sm">
          <SkeletonBlock className="h-10 w-10 rounded-xl" />
          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <SkeletonBlock className="h-8 w-10" />
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-3xl border border-[#e6e6e6] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-7 w-48" />
        </div>
        <SkeletonBlock className="h-10 w-28 rounded-full" />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`partner-skeleton-${index}`} className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-3 w-16" />
                <SkeletonBlock className="h-6 w-36" />
              </div>
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-4 w-48" />
              <SkeletonBlock className="h-4 w-44" />
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-9 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <span className="sr-only">Loading partners...</span>
  </div>
);

function PartnerPage({ partnerSlug = '' }) {
  const pageSize = 10;
  const [partners, setPartners] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const directory = await loadPartnerDirectory({
          partnersLoader: fetchPartners,
          productsLoader: fetchAdminProducts,
          page,
          limit: pageSize
        });
        if (!mounted) return;
        setPartners(directory.partners);
        setProducts(directory.products);
        setPagination(directory.pagination);
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || 'Unable to load partner directory.');
        setPartners([]);
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [page]);

  const selectedPartner = useMemo(() => {
    const targetSlug = slugify(partnerSlug);
    if (!targetSlug) return null;
    return partners.find((partner) => partner.slug === targetSlug || slugify(partner.name) === targetSlug) || null;
  }, [partnerSlug, partners]);

  const partnerCards = useMemo(() => [...partners].sort((a, b) => a.name.localeCompare(b.name)), [partners]);

  const featuredPartner = selectedPartner || partnerCards[0] || null;
  const featuredProducts = useMemo(
    () => (featuredPartner ? resolvePartnerProducts(featuredPartner, products) : []),
    [featuredPartner, products]
  );

  const stats = useMemo(() => {
    const totalPartners = partnerCards.length;
    const activePartners = partnerCards.filter((partner) => partner.status === 'active').length;
    const customDomains = partnerCards.filter((partner) => Boolean(partner.website)).length;
    const assignedProducts = partnerCards.reduce((sum, partner) => sum + (partner.productIds?.length || 0), 0);
    return { totalPartners, activePartners, customDomains, assignedProducts };
  }, [partnerCards]);

  const heroTitle = selectedPartner ? selectedPartner.name : 'Partner Network';
  const heroDescription = selectedPartner
    ? `${selectedPartner.name} is listed in the ExTell partner directory with its location, contact details, and assigned products.`
    : 'Browse every partner added in the admin and open a detail page to see location, products, and contact information.';

  return (
    <>
      <PageHero
        title={heroTitle}
        description={heroDescription}
        actions={
          selectedPartner ? (
            <>
              <Link
                href="/partner"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                <ArrowLeft size={16} />
                Back to partners
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#ed2125] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ed2125]/20"
              >
                Contact us
              </Link>
            </>
          ) : (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#ed2125] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ed2125]/20"
            >
              Request partner access
            </Link>
          )
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-14">
       

        {loading ? (
          <PartnerPageSkeleton />
        ) : (
          <>
            {error ? (
              <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {error}
              </div>
            ) : null}

            {partnerSlug && !selectedPartner ? (
              <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                No partner matched the slug <span className="font-semibold">{partnerSlug}</span>. Showing the full directory below.
              </div>
            ) : null}

            {selectedPartner ? (
              <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl  bg-[#0f1115] p-6 text-white shadow-2xl">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ff9f9f]">Partner profile</p>
                      <h3 className="mt-2 text-3xl font-bold">{selectedPartner.name}</h3>
                      <p className="mt-2 max-w-2xl text-sm text-slate-300">
                        {selectedPartner.location || 'Location on request'}.
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
                      {selectedPartner.status}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact person</p>
                      <p className="mt-2 text-sm font-medium">{selectedPartner.contactName || 'Not listed'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</p>
                      <p className="mt-2 text-sm font-medium">{selectedPartner.email || 'Not listed'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Phone</p>
                      <p className="mt-2 text-sm font-medium">{selectedPartner.phone || 'Not listed'}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Website</p>
                      <p className="mt-2 text-sm font-medium">
                        {selectedPartner.website || `${selectedPartner.slug}.extellsystems.com`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold">Partner products</h4>
                      <span className="text-xs text-slate-400">{featuredProducts.length} items assigned</span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {featuredProducts.length ? (
                        featuredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between gap-3 rounded-2xl bg-black/20 px-4 py-3"
                          >
                            <div>
                              <p className="font-medium text-white">{product.name}</p>
                              <p className="text-xs text-slate-300">{product.sku || product.short || 'Assigned product'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-white">x{product.quantity || 1}</p>
                              {product.price ? <p className="text-xs text-slate-300">{toCurrency(product.price)}</p> : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-5 text-sm text-slate-300">
                          No assigned products were found for this partner yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl  bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#ed2125]">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ed2125]">Location</p>
                        <h4 className="mt-1 text-xl font-bold text-[#111]">{selectedPartner.location || 'Location on request'}</h4>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                        <MapPin size={18} className="mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Address</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedPartner.address || 'Not listed'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                        <Mail size={18} className="mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Email</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedPartner.email || 'Not listed'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                        <Phone size={18} className="mt-0.5 text-slate-500" />
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Phone</p>
                          <p className="mt-1 text-sm text-slate-700">{selectedPartner.phone || 'Not listed'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Public portal</p>
                      <p className="mt-2 text-sm text-slate-700">
                        {selectedPartner.website || `${selectedPartner.slug}.extellsystems.com`}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-[#e6e6e6] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ed2125]">Quick view</p>
                        <h4 className="mt-2 text-xl font-bold text-[#111]">Partner details</h4>
                      </div>
                      <CheckCircle2 className="text-slate-400" size={18} />
                    </div>

                    <div className="mt-5 grid gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Products</p>
                        <p className="mt-2 text-sm text-slate-700">{featuredProducts.length} assigned products</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Login email</p>
                        <p className="mt-2 text-sm text-slate-700">{selectedPartner.loginEmail || 'Not listed'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-10 rounded-3xl border border-[#e6e6e6] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ed2125]">Partner roster</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#111]">
                    {selectedPartner ? 'More partners' : 'All partners'}
                  </h3>
                </div>
                {selectedPartner ? (
                  <Link href="/partner" className="text-sm font-semibold text-[#ed2125] hover:underline">
                    View full directory
                  </Link>
                ) : null}
              </div>

              {partnerCards.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {partnerCards.map((partner) => {
                    const isActive = partner.slug === selectedPartner?.slug;
                    const partnerProducts = resolvePartnerProducts(partner, products);
                    return (
                      <article
                        key={partner.id}
                        className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 ${
                          isActive ? 'border-[#111] bg-[#111] text-white' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isActive ? 'text-[#ff9f9f]' : 'text-[#ed2125]'}`}>
                              {partner.status}
                            </p>
                            <h4 className="mt-2 text-xl font-bold">{partner.name}</h4>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {partnerProducts.length} products
                          </span>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                          <div className={`flex items-center gap-2 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                            <MapPin size={14} />
                            <span>{partner.location || 'Location on request'}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                            <Mail size={14} />
                            <span>{partner.email || 'Not listed'}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                            <Globe2 size={14} />
                            <span>{partner.website || `${partner.slug}.extellsystems.com`}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {partnerProducts.slice(0, 3).map((product) => (
                            <span
                              key={product.id}
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                                isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {product.name}
                            </span>
                          ))}
                          {!partnerProducts.length ? (
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                                isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              No products
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <Link
                            href={`/partner/${partner.slug}`}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                              isActive ? 'bg-white text-[#111]' : 'bg-[#111] text-white hover:bg-[#ed2125]'
                            }`}
                          >
                            View details
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No partners have been added yet.
                </div>
              )}

              {!partnerSlug && pagination.totalPages > 1 ? (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                    {pagination.total ? ` • ${pagination.total} partners` : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1 || loading}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
                      disabled={page >= pagination.totalPages || loading}
                      className="rounded-full bg-[#111] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ed2125] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}

        {selectedPartner ? (
          <div className="mt-8">
            <Link href="/partner" className="inline-flex items-center gap-2 text-sm font-semibold text-[#ed2125] hover:underline">
              <ArrowLeft size={16} />
              Back to all partners
            </Link>
          </div>
        ) : null}
      </section>
    </>
  );
}

export default PartnerPage;
