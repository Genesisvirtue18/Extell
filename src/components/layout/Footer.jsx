'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, Linkedin, Twitter, Youtube, Globe } from 'lucide-react';
import { categories } from '../../data/siteData';

const logo = '/assets/logo.png';
const logoWhite = '/assets/logowhite.jpg';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Support', href: '/support' },
  { label: 'UPS Calculator', href: '/ups-calculator' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const offices = [
  {
    id: 'us',
    label: 'United States',
    email: 'sales@extellsystems.com',
  },
  {
    id: 'uae',
    label: 'UAE — Sharjah',
    phone: '+971 6 779 4299',
    phoneLink: 'tel:+97167794299',
    email: 'sales.imea@extellsystems.com',
  },
  {
    id: 'bh',
    label: 'Bahrain',
    phone: '+973 3883 5435',
    phoneLink: 'tel:+97338835435',
    email: 'sales.imea@extellsystems.com',
  },
];

export default function Footer({ theme = 'light' }) {
  const [activeTab, setActiveTab] = useState('us');
  const isDark = theme === 'dark';

  const activeOffice = offices.find((o) => o.id === activeTab) || offices[0];

  return (
    <footer className={isDark ? 'bg-[#050505]' : 'bg-[#f7f8fc]'}>

      {/* ── Pre-footer CTA band ── */}
      <div className="relative overflow-hidden border-t border-b border-white/[0.06] bg-[#080808]">
        <div className="absolute inset-0 bg-tech-grid bg-[size:26px_26px] opacity-[0.05]" />
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#ed2125] opacity-[0.06] blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ed2125]">
                Ready to Deploy
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Power your next project with ExTell
              </h2>
              <p className="mt-2 text-sm text-white/45">
                Get a quote in under 2 hours. No commitment required.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ed2125] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_28px_rgba(237,33,37,0.35)] transition hover:bg-[#d91f23] hover:shadow-[0_12px_36px_rgba(237,33,37,0.45)]"
              >
                Contact Sales
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                View Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className={`border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">

            {/* Col 1 — brand */}
            <div>
              <Image
                src={isDark ? logoWhite : logo}
                alt="ExTell Systems"
                width={148}
                height={38}
                className="h-9 w-auto object-contain"
              />
              <p className={`mt-4 max-w-[260px] text-sm leading-6 ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                Enterprise power electronics, ICT infrastructure, and data center solutions
                delivered globally.
              </p>

              {/* Social links */}
              <div className="mt-6 flex gap-3">
                {[
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Twitter, href: '#', label: 'Twitter / X' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                  { icon: Globe, href: '#', label: 'Website' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
                      isDark
                        ? 'border-white/10 text-white/40 hover:border-[#ed2125]/60 hover:text-[#ed2125]'
                        : 'border-slate-200 text-slate-400 hover:border-[#ed2125]/60 hover:text-[#ed2125]'
                    }`}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — products */}
            <div>
              <h3 className={`mb-4 text-xs font-bold uppercase tracking-[0.16em] ${isDark ? 'text-[#ed2125]' : 'text-[#ed2125]'}`}>
                Products
              </h3>
              <div className="flex flex-col gap-2.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className={`text-sm transition hover:text-[#ed2125] ${isDark ? 'text-white/45' : 'text-slate-500'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  className={`text-sm font-semibold transition hover:text-[#ed2125] ${isDark ? 'text-white/60' : 'text-slate-600'}`}
                >
                  All Products →
                </Link>
              </div>
            </div>

            {/* Col 3 — company */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#ed2125]">
                Company
              </h3>
              <div className="flex flex-col gap-2.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition hover:text-[#ed2125] ${isDark ? 'text-white/45' : 'text-slate-500'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/sitemap.xml"
                  className={`text-sm transition hover:text-[#ed2125] ${isDark ? 'text-white/35' : 'text-slate-400'}`}
                >
                  Sitemap
                </Link>
              </div>
            </div>

            {/* Col 4 — contact tabs */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#ed2125]">
                Contact
              </h3>

              {/* Region tabs */}
              <div className={`flex gap-1 rounded-xl p-1 ${isDark ? 'bg-white/[0.04]' : 'bg-slate-100'}`}>
                {offices.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setActiveTab(o.id)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === o.id
                        ? 'bg-[#ed2125] text-white shadow-sm'
                        : isDark
                        ? 'text-white/40 hover:text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {o.id === 'us' ? 'US' : o.id === 'uae' ? 'UAE' : 'BH'}
                  </button>
                ))}
              </div>

              {/* Active office card */}
              <div className={`mt-3 rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white'}`}>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {activeOffice.label}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {activeOffice.phone && (
                    <a
                      href={activeOffice.phoneLink}
                      className={`flex items-center gap-2 text-sm transition hover:text-[#ed2125] ${isDark ? 'text-white/50' : 'text-slate-500'}`}
                    >
                      <Phone size={12} className="shrink-0 text-[#ed2125]" />
                      {activeOffice.phone}
                    </a>
                  )}
                  <a
                    href={`mailto:${activeOffice.email}`}
                    className={`flex items-center gap-2 break-all text-sm transition hover:text-[#ed2125] ${isDark ? 'text-white/50' : 'text-slate-500'}`}
                  >
                    <Mail size={12} className="shrink-0 text-[#ed2125]" />
                    {activeOffice.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
            <p className={isDark ? 'text-white/30' : 'text-slate-400'}>
              © {new Date().getFullYear()} ExTell Systems. All rights reserved.
            </p>
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
              <span className="font-semibold uppercase tracking-wider">CE Certified</span>
              <span className="h-3 w-px bg-current opacity-30" />
              <span className="font-semibold uppercase tracking-wider">RoHS Compliant</span>
              <span className="h-3 w-px bg-current opacity-30" />
              <span className="font-semibold uppercase tracking-wider">ISO 9001</span>
            </div>
            <p className={isDark ? 'text-white/25' : 'text-slate-400'}>
              Built by{' '}
              <a href="#" className="font-semibold text-[#ed2125] hover:underline">
                Zoed Tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
