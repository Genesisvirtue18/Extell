'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Globe2, Mail, MapPin, Phone, UserRound, Users2 } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { getPartners } from '../lib/api';
import { slugify } from '../lib/partnerDirectory';

const getPartnerItems = (response) => {
  const candidates = [response?.data?.items, response?.items, response?.data, response];
  return candidates.find(Array.isArray) || [];
};

const getLocation = (partner) =>
  [partner.city, partner.state, partner.country].filter(Boolean).join(', ') || partner.address || '';

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
                      {selectedPartner.address || getLocation(selectedPartner) ? <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><MapPin size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Address</p><p className="mt-1 text-sm font-medium text-slate-900">{[...new Set([selectedPartner.address, getLocation(selectedPartner)].filter(Boolean))].join(', ')}</p></div></div> : null}
                      {selectedPartner.email ? <a href={`mailto:${selectedPartner.email}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-red-50"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Mail size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Email</p><p className="mt-1 break-all text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-2">{selectedPartner.email}</p></div></a> : null}
                      {selectedPartner.phone ? <a href={`tel:${selectedPartner.phone}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-red-50"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Phone size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Phone</p><p className="mt-1 text-sm font-medium text-blue-700">{selectedPartner.phone}</p></div></a> : null}
                      {selectedPartner.website ? <a href={/^https?:\/\//i.test(selectedPartner.website) ? selectedPartner.website : `https://${selectedPartner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-red-50"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Globe2 size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Website</p><p className="mt-1 break-all text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-2">{selectedPartner.website}</p></div></a> : null}
                      {!selectedPartner.address && !getLocation(selectedPartner) && !selectedPartner.email && !selectedPartner.phone && !selectedPartner.website ? <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Contact details are not available.</p> : null}
                    </div>
                  </section>
                </div>
              </div>
            ) : null}

            {!selectedPartner ? <div className="mt-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ed2125]"><Users2 size={20} /></span>
                <div><p className="text-xs font-semibold uppercase tracking-wide text-[#ed2125]">Partner network</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{selectedPartner ? 'More partners' : 'Company directory'}</h2></div>
              </div>
              {partnerCards.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {partnerCards.map((partner) => {
                    const location = getLocation(partner);
                    const active = partner.slug === selectedPartner?.slug;
                    return (
                      <article key={partner.id} className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${active ? 'border-red-200 bg-red-50/40' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-start gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Building2 size={19} /></span>
                          <div className="min-w-0"><p className="text-xs font-medium text-slate-500">Company</p><h3 className="mt-1 break-words text-lg font-bold text-slate-950">{partner.companyName || partner.displayName}</h3></div>
                        </div>
                        <div className="mt-5 space-y-3 text-sm text-slate-600">
                          {partner.contactName ? <p><span className="font-medium text-slate-800">Contact:</span> {partner.contactName}</p> : null}
                          {location || partner.address ? <p className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" />{[partner.address, location].filter(Boolean).join(', ')}</p> : null}
                          {partner.email ? <a href={`mailto:${partner.email}`} className="flex items-center gap-2 break-all hover:text-[#ed2125]"><Mail size={15} className="shrink-0" />{partner.email}</a> : null}
                          {partner.phone ? <a href={`tel:${partner.phone}`} className="flex items-center gap-2 hover:text-[#ed2125]"><Phone size={15} className="shrink-0" />{partner.phone}</a> : null}
                          {partner.website ? <a href={/^https?:\/\//i.test(partner.website) ? partner.website : `https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 break-all hover:text-[#ed2125]"><Globe2 size={15} className="shrink-0" />{partner.website}</a> : null}
                        </div>
                        <Link href={`/partner/${partner.slug}`} className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#ed2125]">View company</Link>
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
