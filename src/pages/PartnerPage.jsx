'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Mail, MapPin, Phone, UserRound, Users2 } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { getPartners } from '../lib/api';
import { slugify } from '../lib/partnerDirectory';

const getPartnerItems = (response) => {
  const candidates = [response?.data?.items, response?.items, response?.data, response];
  return candidates.find(Array.isArray) || [];
};

const getLocation = (partner) => {
  const country = String(partner?.country || '').trim();
  if (/\b(?:UAE|United Arab Emirates)\b/i.test(country)) return 'UAE';
  return [partner?.city, partner?.state, country].filter(Boolean).join(', ') || partner?.address || '';
};

const getAddress = (partner) => {
  const address = String(partner?.address || '').trim();
  if (/^(?:UAE|United Arab Emirates)\s*[-,]\s*Sharjah$|^Sharjah\s*[-,]\s*(?:UAE|United Arab Emirates)$/i.test(address)) return 'UAE';
  return address;
};

const PartnerPageSkeleton = () => (
  <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading partners" role="status">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="mt-5 h-6 w-2/3 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
        <div className="mt-8 h-4 w-full rounded bg-slate-100" />
      </div>
    ))}
    <span className="sr-only">Loading partners...</span>
  </div>
);

function PartnerPage({ partnerSlug = '' }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getPartners()
      .then((response) => {
        if (!mounted) return;
        const items = getPartnerItems(response).map((partner, index) => {
          const name = partner.companyName || partner.name || `Partner ${index + 1}`;
          return { ...partner, displayName: name, slug: partner.slug || slugify(name), id: partner._id || partner.slug || name };
        });
        setPartners(items);
      })
      .catch((loadError) => {
        if (mounted) setError(loadError?.message || 'Unable to load partner directory.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const partnerCards = useMemo(
    () => [...partners].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [partners]
  );
  const selectedPartner = useMemo(() => {
    const target = slugify(partnerSlug);
    return target ? partnerCards.find((partner) => partner.slug === target || slugify(partner.displayName) === target) || null : null;
  }, [partnerSlug, partnerCards]);
  const title = selectedPartner?.companyName || selectedPartner?.displayName || 'Our Partners';
  const description = selectedPartner
    ? 'Your trusted partner for global business growth.'
    : 'Meet the companies in the ExTell Systems partner network and find their contact information.';

  return (
    <>
      <PageHero
        title={title}
        description={description}
        heroImage="/assets/homebg.jpg"
        actions={selectedPartner ? (
          <Link href="/partner" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
            <ArrowLeft size={16} /> Back to partners
          </Link>
        ) : null}
      />

      <section className="mx-auto max-w-7xl px-6 py-14">
        {loading ? <PartnerPageSkeleton /> : (
          <>
            {error ? <div className="mt-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div> : null}
            {partnerSlug && !selectedPartner && !error ? (
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                No partner matched “{partnerSlug}”. Showing the full directory.
              </div>
            ) : null}

            {selectedPartner ? (
              <div className="mt-2 grid items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                  <div className="relative flex min-h-28 items-start justify-between overflow-hidden bg-gradient-to-br from-[#ed102b] via-[#9d1028] to-[#11131a] px-7 py-6 text-white md:px-9">
                    <div className="absolute -bottom-20 left-1/3 h-40 w-72 rounded-full bg-white/10 blur-2xl" />
                    <span className="relative rounded-full bg-black/25 px-4 py-2 text-sm font-semibold">Partner Profile</span>
                    <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/20 px-4 py-2 text-sm font-semibold capitalize">
                      <span className={`h-2.5 w-2.5 rounded-full ${selectedPartner.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                      {selectedPartner.status || 'Listed'}
                    </span>
                  </div>
                  <div className="relative -mt-5 rounded-t-[2rem] bg-white px-7 pb-8 pt-8 md:px-9">
                    <div className="flex items-center gap-5 border-b border-slate-200 pb-7">
                      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#ed2125] ring-8 ring-white"><Building2 size={34} /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ed2125]">Company</p>
                        <h2 className="mt-1 break-words text-2xl font-bold leading-tight text-slate-950 md:text-3xl">{selectedPartner.companyName || selectedPartner.displayName}</h2>
                        {selectedPartner.name && selectedPartner.name !== selectedPartner.companyName ? <p className="mt-1 text-lg text-slate-500">{selectedPartner.name}</p> : null}
                      </div>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {selectedPartner.contactName ? <div className="flex items-start gap-4 py-6"><UserRound size={21} className="mt-1 shrink-0 text-slate-800" /><div><p className="text-sm text-slate-500">Contact Person</p><p className="mt-1 text-lg font-medium text-slate-900">{selectedPartner.contactName}</p></div></div> : null}
                      {getLocation(selectedPartner) || selectedPartner.address ? <div className="flex items-start gap-4 py-6"><MapPin size={21} className="mt-1 shrink-0 text-slate-800" /><div><p className="text-sm text-slate-500">Location</p><p className="mt-1 text-lg font-medium text-slate-900">{getLocation(selectedPartner)}</p></div></div> : null}
                    </div>
                  </div>
                </article>

                <div className="space-y-5">
                  <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-7">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#ed2125]"><Mail size={24} /></span>
                      <div><h2 className="text-xl font-bold text-slate-950">Contact Details</h2><p className="mt-1 text-sm text-slate-500">Reach out to this partner</p></div>
                    </div>
                    <div className="space-y-2">
                      {selectedPartner.address || getLocation(selectedPartner) ? <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><MapPin size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Address</p><p className="mt-1 text-sm font-medium text-slate-900">{[...new Set([getAddress(selectedPartner), getLocation(selectedPartner)].filter(Boolean))].join(', ')}</p></div></div> : null}
                      {selectedPartner.email ? <a href={`mailto:${selectedPartner.email}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-red-50"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Mail size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Email</p><p className="mt-1 break-all text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-2">{selectedPartner.email}</p></div></a> : null}
                      {selectedPartner.phone ? <a href={`tel:${selectedPartner.phone}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-red-50"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Phone size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Phone</p><p className="mt-1 text-sm font-medium text-blue-700">{selectedPartner.phone}</p></div></a> : null}
                      {!selectedPartner.address && !getLocation(selectedPartner) && !selectedPartner.email && !selectedPartner.phone ? <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Contact details are not available.</p> : null}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}

            {!selectedPartner ? <div className="mt-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ed2125]"><Users2 size={20} /></span>
                <div><h2 className=" text-2xl font-bold text-slate-950">{selectedPartner ? 'More partners' : 'Company directory'}</h2></div>
              </div>
              {partnerCards.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {partnerCards.map((partner) => {
                    const location = getLocation(partner);
                    const active = partner.slug === selectedPartner?.slug;
                    return (
                      <article key={partner.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
                        <div className="relative flex min-h-[112px] items-end overflow-hidden bg-gradient-to-br from-[#ed102b] via-[#a00b28] to-[#101014] px-5 pb-5 pt-6 text-white">
                          <div className="absolute -right-10 -top-24 h-56 w-56 rounded-full border-[30px] border-white/[0.06]" />
                          <div className="absolute -right-2 -top-28 h-64 w-64 rounded-full border-[28px] border-black/[0.12]" />
                          <div className="relative min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Company</p>
                            <h3 className="mt-1 break-words text-lg font-bold leading-tight text-white md:text-xl">{partner.companyName || partner.displayName}</h3>
                          </div>
                          {partner.status ? <span className="relative ml-auto shrink-0 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[11px] font-semibold capitalize">{partner.status}</span> : null}
                        </div>
                        <div className="flex flex-1 items-start gap-4 px-5 pb-5 pt-5">
                          <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-[#ffe6e9] ring-4 ring-white">
                            <img src="/favicon.png" alt="" className="h-10 w-10 object-contain" />
                          </span>
                          <div className="min-w-0 flex-1 space-y-3 pt-1 text-sm text-slate-700">
                            {partner.contactName ? <div><p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">Contact Person</p><p className="mt-0.5 break-words font-semibold text-slate-800">{partner.contactName}</p></div> : null}
                            {location || partner.address ? <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-[#ed2125]" /><span>{[...new Set([getAddress(partner), location].filter(Boolean))].join(', ')}</span></p> : null}
                            {partner.email ? <a href={`mailto:${partner.email}`} className="flex items-start gap-2 break-all hover:text-[#ed2125]"><Mail size={16} className="mt-0.5 shrink-0 text-[#ed2125]" /><span>{partner.email}</span></a> : null}
                            {partner.phone ? <a href={`tel:${partner.phone}`} className="flex items-start gap-2 hover:text-[#ed2125]"><Phone size={16} className="mt-0.5 shrink-0 text-[#ed2125]" /><span>{partner.phone}</span></a> : null}
                          </div>
                        </div>
                        <div className="px-5 pb-5">
                          <Link href={`/partner/${partner.slug}`} aria-label={`View ${partner.companyName || partner.displayName}`} className="flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ed102b] to-[#a00b28] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-red-900/20 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#ed2125] focus:ring-offset-2">
                            View company
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No active partners are available at the moment.</p>
              )}
            </div> : null}
          </>
        )}
      </section>
    </>
  );
}

export default PartnerPage;
