'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, Phone, ChevronsUp } from 'lucide-react';
import { categories } from '../../data/siteData';

/* logo.png = all-white transparent logo — always used on the dark footer */
const logoWhite = '/assets/logo.png';

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

const BG = '#08080a';
const RED = '#ed2125';

export default function Footer() {
  const [activeTab, setActiveTab] = useState('us');
  const active = offices.find((o) => o.id === activeTab) || offices[0];

  const scrollToTop = () =>
    typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ background: BG }}>

      {/* ── Main section ── */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-12 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr]">

            {/* ── Brand column ── */}
            <div>
              <Image
                src={logoWhite}
                alt="ExTell Systems"
                width={140}
                height={36}
                className="h-9 w-auto object-contain"
              />

              <p
                className="mt-5 max-w-[240px] text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.58)' }}
              >
                Enterprise power, ICT, and data center infrastructure delivered globally.
              </p>

              {/* Get a Quote CTA */}
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-90"
                style={{ background: '#ed2125', color: '#fff' }}
              >
                Get a Quote
              </Link>

              {/* Social icons */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/extellsystems/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ExTell on LinkedIn"
                  className="transition-opacity hover:opacity-80"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  <Linkedin size={18} />
                </a>
              </div>

              {/* Back to top */}
              <button
                type="button"
                onClick={scrollToTop}
                className="mt-10 inline-flex items-center gap-2.5 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition hover:bg-white/10"
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(255,255,255,0.28)',
                }}
              >
                <ChevronsUp size={15} />
                Back to Top
              </button>
            </div>

            {/* ── Site Map (Products) ── */}
            <div>
              <p
                className="mb-5 text-xs font-bold uppercase tracking-[0.12em]"
                style={{ color: RED }}
              >
                Site Map
              </p>
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Homepage
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="text-sm transition-opacity hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  className="text-sm font-medium transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  All Products →
                </Link>
              </nav>
            </div>

            {/* ── Company ── */}
            <div>
              <p
                className="mb-5 text-xs font-bold uppercase tracking-[0.12em]"
                style={{ color: RED }}
              >
                Company
              </p>
              <nav className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm transition-opacity hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ── Contact ── */}
            <div>
              <p
                className="mb-5 text-xs font-bold uppercase tracking-[0.12em]"
                style={{ color: RED }}
              >
                Contact Us
              </p>

              {/* Office tabs */}
              <div
                className="flex gap-1 rounded-lg p-1"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                {offices.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setActiveTab(o.id)}
                    className="flex-1 rounded-md py-1.5 text-xs font-semibold transition"
                    style={
                      activeTab === o.id
                        ? { background: RED, color: '#fff' }
                        : { color: 'rgba(255,255,255,0.55)' }
                    }
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Active office details */}
              <div
                className="mt-3 rounded-xl p-4"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p
                  className="mb-3 text-xs font-semibold"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {active.label}
                </p>
                {active.phone && (
                  <a
                    href={active.phoneLink}
                    className="mb-2 flex items-center gap-2 text-sm transition-opacity hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    <Phone size={11} style={{ color: RED }} className="shrink-0" />
                    {active.phone}
                  </a>
                )}
                <a
                  href={`mailto:${active.email}`}
                  className="flex items-center gap-2 break-all text-sm transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <Mail size={11} style={{ color: RED }} className="shrink-0" />
                  {active.email}
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── Red bottom bar ── */}
      <div style={{ background: RED }}>
        <div className="mx-auto max-w-6xl px-6 py-3 sm:px-8">
          <p className="text-center text-[0.72rem] font-medium text-white">
            Copyright © {new Date().getFullYear()}, extellsystems.com. All Rights Reserved.
            {' '}&nbsp;·&nbsp;{' '}
            Created by <span className="font-bold">Geode Tech</span>
          </p>
        </div>
      </div>

    </footer>
  );
}
