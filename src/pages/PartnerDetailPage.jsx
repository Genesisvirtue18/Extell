'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Globe2, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { getPartners } from '../lib/api';
import { slugify } from '../lib/partnerDirectory';

const getPartnerItems = (response) => {
  const candidates = [response?.data?.items, response?.items, response?.data, response];
  return candidates.find(Array.isArray) || [];
};

const getPartnerLocation = (partner) =>
  [partner?.city, partner?.state, partner?.country].filter(Boolean).join(', ');

function PartnerDetailPage({ partnerSlug = '' }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getPartners()
      .then((response) => {
        if (!mounted) return;
        setPartners(getPartnerItems(response));
      })
      .catch((loadError) => {
        if (mounted) setError(loadError?.message || 'Unable to load partner details.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const partner = useMemo(() => {
    const target = slugify(partnerSlug);
    return partners.find((item) =>
      slugify(item.slug) === target || slugify(item.companyName) === target || slugify(item.name) === target
    ) || null;
  }, [partnerSlug, partners]);

  const companyName = partner?.companyName || partner?.name || 'Partner details';
  const location = getPartnerLocation(partner);
  const address = [...new Set([partner?.address, location].filter(Boolean))].join(', ');
  const websiteHref = partner?.website
    ? (/^https?:\/\//i.test(partner.website) ? partner.website : `https://${partner.website}`)
    : '';

  if (loading) {
    return (
      <>
        <PageHero title="Partner details" description="Loading partner information..." heroImage="/assets/homebg.jpg" />
        <section className="mx-auto grid max-w-7xl animate-pulse gap-5 px-6 py-12 lg:grid-cols-2" role="status" aria-label="Loading partner details">
          <div className="h-[34rem] rounded-[2rem] bg-slate-200" />
          <div className="h-[26rem] rounded-[2rem] bg-slate-200" />
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        title={companyName}
        description={partner ? 'Your trusted partner for global business growth.' : error || 'Partner information is unavailable.'}
        heroImage="/assets/homebg.jpg"
        actions={(
          <Link href="/partner" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
            <ArrowLeft size={16} /> Back to Partners
          </Link>
        )}
      />

      <section className="mx-auto max-w-7xl px-5 py-9 md:px-6 md:py-12">
        {!partner ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            {error || `No partner matched “${partnerSlug}”.`}
          </div>
        ) : (
          <div className="grid items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="relative flex min-h-28 items-start justify-between overflow-hidden bg-gradient-to-br from-[#ed102b] via-[#9d1028] to-[#11131a] px-6 py-6 text-white md:px-9">
                <div className="absolute -bottom-20 left-1/3 h-40 w-72 rounded-full bg-white/10 blur-2xl" />
                <span className="relative rounded-full bg-black/25 px-4 py-2 text-sm font-semibold">Partner Profile</span>
                <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/20 px-4 py-2 text-sm font-semibold capitalize">
                  <span className={`h-2.5 w-2.5 rounded-full ${partner.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  {partner.status || 'Listed'}
                </span>
              </div>
              <div className="relative -mt-5 rounded-t-[2rem] bg-white px-6 pb-7 pt-8 md:px-9 md:pb-9">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-7 md:gap-5">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#ed2125] ring-8 ring-white md:h-20 md:w-20"><Building2 size={32} /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ed2125]">Company</p>
                    <h2 className="mt-1 break-words text-2xl font-bold leading-tight text-slate-950 md:text-3xl">{companyName}</h2>
                    {partner.name && partner.name !== companyName ? <p className="mt-1 text-lg text-slate-500">{partner.name}</p> : null}
                  </div>
                </div>
                <div className="divide-y divide-slate-200">
                  {partner.contactName ? (
                    <div className="flex items-start gap-4 py-6"><UserRound size={21} className="mt-1 shrink-0 text-slate-800" /><div><p className="text-sm text-slate-500">Contact Person</p><p className="mt-1 text-lg font-medium text-slate-900">{partner.contactName}</p></div></div>
                  ) : null}
                  {location || partner.address ? (
                    <div className="flex items-start gap-4 py-6"><MapPin size={21} className="mt-1 shrink-0 text-slate-800" /><div><p className="text-sm text-slate-500">Location</p><p className="mt-1 text-lg font-medium text-slate-900">{location || partner.address}</p></div></div>
                  ) : null}
                </div>
              </div>
            </article>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 md:p-7">
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#ed2125]"><Mail size={24} /></span>
                <div><h2 className="text-xl font-bold text-slate-950">Contact Details</h2><p className="mt-1 text-sm text-slate-500">Reach out to your partner</p></div>
              </div>
              <div className="space-y-2">
                {address ? <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3.5 md:p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><MapPin size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Address</p><p className="mt-1 text-sm font-medium text-slate-900">{address}</p></div></div> : null}
                {partner.email ? <a href={`mailto:${partner.email}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3.5 transition hover:bg-red-50 md:p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Mail size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Email</p><p className="mt-1 break-all text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-2">{partner.email}</p></div></a> : null}
                {partner.phone ? <a href={`tel:${partner.phone}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3.5 transition hover:bg-red-50 md:p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Phone size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Phone</p><p className="mt-1 text-sm font-medium text-blue-700">{partner.phone}</p></div></a> : null}
                {websiteHref ? <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3.5 transition hover:bg-red-50 md:p-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/70 text-[#ed2125]"><Globe2 size={20} /></span><div className="min-w-0"><p className="text-xs font-medium text-slate-500">Website</p><p className="mt-1 break-all text-sm font-medium text-blue-700 underline decoration-blue-200 underline-offset-2">{partner.website}</p></div></a> : null}
                {!address && !partner.email && !partner.phone && !partner.website ? <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Contact details are not available.</p> : null}
              </div>
            </section>
          </div>
        )}
      </section>
    </>
  );
}

export default PartnerDetailPage;
