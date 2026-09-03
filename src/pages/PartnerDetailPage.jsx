'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Globe2, Mail, MapPin, Package, Phone } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { fetchAdminProducts, fetchPartners } from '../admin/services/api';
import { loadPartnerDirectory, resolvePartnerProducts, slugify } from '../lib/partnerDirectory';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} aria-hidden="true" />
);

function PartnerDetailPage({ partnerSlug = '' }) {
  const [partner, setPartner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const directory = await loadPartnerDirectory({
          partnersLoader: fetchPartners,
          productsLoader: fetchAdminProducts
        });
        const target = slugify(partnerSlug);
        const match = directory.partners.find(
          (item) => item.slug === target || slugify(item.name) === target
        );

        if (!mounted) return;
        setPartner(match || null);
        setProducts(directory.products);
        if (!match) setError(`No partner matched the slug "${partnerSlug}".`);
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError?.message || 'Unable to load partner details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [partnerSlug]);

  const assignedProducts = useMemo(
    () => (partner ? resolvePartnerProducts(partner, products) : []),
    [partner, products]
  );

  if (loading) {
    return (
      <>
        <PageHero title="Partner details" description="Loading partner information..." />
        <section className="mx-auto max-w-7xl px-6 py-14" role="status" aria-label="Loading partner details">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl bg-[#0f1115] p-6">
              <SkeletonBlock className="h-3 w-28 bg-white/20" />
              <SkeletonBlock className="mt-4 h-10 w-64 bg-white/20" />
              <SkeletonBlock className="mt-3 h-4 w-48 bg-white/20" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-20 rounded-2xl bg-white/10" />
                ))}
              </div>
              <SkeletonBlock className="mt-6 h-40 rounded-2xl bg-white/10" />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <SkeletonBlock className="h-8 w-40" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-16 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={partner?.name || 'Partner details'}
        description={partner ? `${partner.name} partner profile, location, products, and contact details.` : error}
        actions={
          <Link href="/partner" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-red-500 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
            <ArrowLeft size={16} />
            Back to partners
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-14">
        {!partner ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">{error}</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl bg-[#0f1115] p-6 text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#ff9f9f]">Partner profile</p>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">{partner.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">{partner.location || 'Location on request'}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase text-slate-200">
                  {partner.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['Contact person', partner.contactName],
                  ['Email', partner.email],
                  ['Phone', partner.phone],
                  ['Website', partner.website || `${partner.slug}.extellsystems.com`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-2 text-sm font-medium">{value || 'Not listed'}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-400">Assigned products</p>
                  <p className="text-sm font-semibold text-slate-400">Assigned products</p>
                  <span className="text-xs text-slate-400">{assignedProducts.length} items</span>
                </div>
                <div className="mt-4 space-y-3">
                  {assignedProducts.length ? assignedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-slate-300">{product.sku || 'Assigned product'}</p>
                      </div>
                      <span className="text-sm font-semibold">x{product.quantity || 1}</span>
                    </div>
                  )) : <p className="text-sm text-slate-300">No assigned products were found.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-[#ed2125]" />
                  <h3 className="text-2xl font-bold text-[#111]">Contact details</h3>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    [MapPin, 'Address', partner.address || partner.location],
                    [Mail, 'Email', partner.email],
                    [Phone, 'Phone', partner.phone],
                    [Globe2, 'Website', partner.website || `${partner.slug}.extellsystems.com`]
                  ].map(([Icon, label, value]) => (
                    <div key={label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                      <Icon size={18} className="mt-0.5 text-slate-500" />
                      <div><p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p><p className="mt-1 text-sm text-slate-700">{value || 'Not listed'}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3"><Package size={20} className="text-[#ed2125]" /><h3 className="text-xl font-bold text-[#111]">Partner summary</h3></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.25em] text-slate-400">Products</p><p className="mt-2 text-sm text-slate-700">{assignedProducts.length} assigned</p></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default PartnerDetailPage;
