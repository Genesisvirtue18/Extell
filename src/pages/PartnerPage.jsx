'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Globe2, Mail, MapPin, Phone, Users2 } from 'lucide-react';
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
  const title = selectedPartner?.displayName || 'Our Partners';
  const description = selectedPartner
    ? `Contact and company information for ${selectedPartner.displayName}.`
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
              <article className="mt-2 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#ed2125]"><Building2 size={25} /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#ed2125]">Company</p>
                    <h2 className="mt-1 break-words text-2xl font-bold text-slate-950 md:text-3xl">{selectedPartner.companyName || selectedPartner.displayName}</h2>
                    {selectedPartner.contactName ? <p className="mt-2 text-slate-600">Contact: {selectedPartner.contactName}</p> : null}
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {getLocation(selectedPartner) || selectedPartner.address ? (
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><MapPin size={18} className="mt-0.5 shrink-0 text-slate-500" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p><p className="mt-1 text-sm text-slate-800">{[selectedPartner.address, getLocation(selectedPartner)].filter(Boolean).join(', ')}</p></div></div>
                  ) : null}
                  {selectedPartner.email ? <a href={`mailto:${selectedPartner.email}`} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 hover:bg-red-50"><Mail size={18} className="mt-0.5 shrink-0 text-slate-500" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p><p className="mt-1 break-all text-sm text-slate-800">{selectedPartner.email}</p></div></a> : null}
                  {selectedPartner.phone ? <a href={`tel:${selectedPartner.phone}`} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 hover:bg-red-50"><Phone size={18} className="mt-0.5 shrink-0 text-slate-500" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p><p className="mt-1 text-sm text-slate-800">{selectedPartner.phone}</p></div></a> : null}
                  {selectedPartner.website ? <a href={/^https?:\/\//i.test(selectedPartner.website) ? selectedPartner.website : `https://${selectedPartner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 hover:bg-red-50"><Globe2 size={18} className="mt-0.5 shrink-0 text-slate-500" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Website</p><p className="mt-1 break-all text-sm text-slate-800">{selectedPartner.website}</p></div></a> : null}
                </div>
              </article>
            ) : null}

            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
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
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default PartnerPage;
