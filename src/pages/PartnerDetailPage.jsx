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

const PartnerSkyline = () => (
  <svg viewBox="0 0 900 250" preserveAspectRatio="xMidYMax meet" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-52 w-full text-[#c8cad8] opacity-80">
    <defs>
      <linearGradient id="partner-skyline-fade" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <path fill="url(#partner-skyline-fade)" d="M0 204h62v-25h8v-31h6v31h9v25h39v-45h7v-36h6v36h8v45h46v-27h9v-57h6v-24q7-18 14 0v24h6v57h8v27h51v-35h9v-58h5v-22q6-17 12 0v22h6v58h9v35h45v-21h10v-50h7v-20q8-21 16 0v20h6v50h10v21h45v-39h11v-52h6v-26q8-24 16 0v26h6v52h11v39h35v-31h9v-71h6v-28q8-25 16 0v28h6v71h9v31h33v-40h9v-89h6v-28q8-25 16 0v28h6v89h9v40h40v-28h10v-50h7v-19q7-19 14 0v19h7v50h10v28h34v-54h10v-43h8v-18q7-19 14 0v18h8v43h10v54h32v-27h12v-47h8v-22q8-20 16 0v22h8v47h12v27h59v46H0z" />
    <path fill="currentColor" opacity=".62" d="M397 201a69 69 0 0 1 138 0zm55-4h28v-24l14 24h-56l14-24zm-35-10h12v-41h-12zm-5-41h22l-11-14zm88 41h12v-41h-12zm-5-41h22l-11-14z" />
    <path d="M0 224c132-28 212-18 320-2 148 22 282-18 398-18 68 0 119 13 182 20v26H0z" fill="white" opacity=".58" />
  </svg>
);

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
            <article className="relative min-h-[610px] overflow-hidden rounded-[2rem] border border-[#e5e7eb] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
              <div className="absolute inset-x-0 top-0 h-[190px] overflow-hidden bg-gradient-to-br from-[#e10624] via-[#a00b28] to-[#0b0b0b]">
                <div className="absolute -right-12 -top-32 h-72 w-72 rounded-full border-[38px] border-white/[0.035]" />
                <div className="absolute right-20 -top-36 h-80 w-80 rounded-full border-[34px] border-black/[0.12]" />
                <svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-24 w-full">
                  <path fill="white" d="M0 72C126 5 173 26 305 63c114 32 153 74 283 57 116-15 204-71 412-83v163H0z" />
                </svg>
              </div>
              <div className="relative z-10 flex items-center justify-between gap-3 px-6 pt-7 md:px-9">
                <span className="rounded-full bg-[#650b1b]/90 px-4 py-2 text-xs font-semibold text-white">Partner Profile</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-[#101a18]/90 px-4 py-2 text-xs font-semibold capitalize text-white">
                  <span className={`h-2.5 w-2.5 rounded-full ${partner.status === 'active' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  {partner.status || 'Listed'}
                </span>
              </div>
              <div className="relative z-10 px-6 pb-8 pt-14 md:px-9 md:pt-16">
                <div className="flex min-h-[132px] items-center gap-5 border-b border-[#e5e7eb] pb-7">
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#ffe6e9] md:h-24 md:w-24"><img src="/favicon.png" alt="" className="h-12 w-12 object-contain md:h-14 md:w-14" /></span>
                  <div className="min-w-0"><h2 className="break-words text-xl font-bold leading-tight text-[#0f172a] md:text-2xl">{companyName}</h2>{partner.name && partner.name !== companyName ? <p className="mt-1.5 text-base font-medium text-[#6b7280] md:text-lg">{partner.name}</p> : null}</div>
                </div>
                <div className="relative z-10 divide-y divide-[#e5e7eb] pb-24">
                  {partner.contactName ? <div className="flex items-start gap-4 py-6"><UserRound size={23} fill="currentColor" className="mt-1 shrink-0 text-[#0f172a]" /><div><p className="text-sm text-[#6b7280] md:text-base">Contact Person</p><p className="mt-1 text-base font-medium text-[#0f172a] md:text-lg">{partner.contactName}</p></div></div> : null}
                  {location || partner.address ? <div className="flex items-start gap-4 py-6"><MapPin size={23} fill="currentColor" className="mt-1 shrink-0 text-[#0f172a]" /><div><p className="text-sm text-[#6b7280] md:text-base">Location</p><p className="mt-1 text-base font-medium text-[#0f172a] md:text-lg">{location || partner.address}</p></div></div> : null}
                </div>
                <PartnerSkyline />
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
