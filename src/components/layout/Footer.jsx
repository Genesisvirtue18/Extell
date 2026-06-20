'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { categories } from '../../data/siteData';

const logo = '/assets/logo.png';
const logoWhite = '/assets/logowhite.jpg';

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Support', href: '/support' },
  { label: 'UPS Calculator', href: '/ups-calculator' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

const offices = [
  { id: 'us', label: 'US', email: 'sales@extellsystems.com' },
  {
    id: 'uae',
    label: 'UAE',
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
  const active = offices.find((o) => o.id === activeTab) || offices[0];

  const text = isDark ? 'text-neutral-400' : 'text-slate-500';
  const hover = 'hover:text-[#ed2125] transition-colors';
  const divider = isDark ? 'border-white/10' : 'border-slate-200';

  return (
    <footer className={isDark ? 'bg-[#08080a]' : 'bg-white'}>

      {/* ── Main grid ── */}
      <div className={`border-t ${divider}`}>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">

            {/* Brand */}
            <div>
              <Image
                src={isDark ? logoWhite : logo}
                alt="ExTell Systems"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
              />
              <p className={`mt-3 max-w-[230px] text-sm leading-relaxed ${text}`}>
                Enterprise power, ICT, and data center infrastructure delivered globally.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#ed2125] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#d91f23]"
              >
                Get a Quote
              </Link>
            </div>

            {/* Products */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#ed2125]">Products</p>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/products?category=${cat.slug}`} className={`text-sm ${text} ${hover}`}>
                    {cat.name}
                  </Link>
                ))}
                <Link href="/products" className={`text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-600'} ${hover}`}>
                  All Products →
                </Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#ed2125]">Company</p>
              <div className="flex flex-col gap-2">
                {companyLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={`text-sm ${text} ${hover}`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#ed2125]">Contact</p>

              {/* Tab buttons */}
              <div className={`flex gap-1 rounded-lg p-1 ${isDark ? 'bg-white/[0.04]' : 'bg-slate-100'}`}>
                {offices.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setActiveTab(o.id)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                      activeTab === o.id
                        ? 'bg-[#ed2125] text-white'
                        : `${text} hover:${isDark ? 'text-white' : 'text-slate-800'}`
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Active office */}
              <div className={`mt-3 rounded-xl border p-4 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <p className={`mb-2.5 text-xs font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{active.label}</p>
                {active.phone && (
                  <a href={active.phoneLink} className={`flex items-center gap-2 mb-1.5 text-sm ${text} ${hover}`}>
                    <Phone size={11} className="text-[#ed2125] shrink-0" />
                    {active.phone}
                  </a>
                )}
                <a href={`mailto:${active.email}`} className={`flex items-center gap-2 text-sm break-all ${text} ${hover}`}>
                  <Mail size={11} className="text-[#ed2125] shrink-0" />
                  {active.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`border-t ${divider}`}>
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-2 text-xs sm:flex-row">
            <p className={text}>© {new Date().getFullYear()} ExTell Systems. All rights reserved.</p>
            <p className={text}>
              Built by{' '}
              <a href="#" className="font-semibold text-[#ed2125] hover:underline">Zoed Tech</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
