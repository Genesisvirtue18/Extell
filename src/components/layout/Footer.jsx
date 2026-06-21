'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, Phone, ChevronsUp } from 'lucide-react';
import { categories } from '../../data/siteData';

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
  { id: 'uae', label: 'UAE', phone: '+971 6 779 4299', phoneLink: 'tel:+97167794299', email: 'sales.imea@extellsystems.com' },
  { id: 'bh', label: 'Bahrain', phone: '+973 3883 5435', phoneLink: 'tel:+97338835435', email: 'sales.imea@extellsystems.com' },
];

const BG = '#08080a';
const RED = '#ed2125';
const MUTED = 'rgba(255,255,255,0.6)';
const FAINT = 'rgba(255,255,255,0.08)';

export default function Footer() {
  const [activeTab, setActiveTab] = useState('us');
  const active = offices.find((o) => o.id === activeTab) || offices[0];
  const scrollToTop = () => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ background: BG }}>

      {/* ── Main section ── */}
      <div style={{ borderTop: `1px solid ${FAINT}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem 3rem' }}>

          {/* Back to Top — extreme right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <button
              type="button"
              onClick={scrollToTop}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.1rem',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'transparent',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ChevronsUp size={14} />
              Back to Top
            </button>
          </div>

          {/* ── 3-column grid: Brand | SiteMap+Company | Contact ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1.3fr',
            gap: '3rem',
          }}
            className="footer-main-grid"
          >

            {/* ── Brand ── */}
            <div>
              <Image src={logoWhite} alt="ExTell Systems" width={130} height={34} style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
              <p style={{ marginTop: '1.1rem', fontSize: '0.85rem', lineHeight: 1.6, color: MUTED, maxWidth: 220 }}>
                Enterprise power, ICT, and data center infrastructure delivered globally.
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  marginTop: '1.2rem', padding: '0.45rem 1rem',
                  background: RED, color: '#fff',
                  borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Get a Quote
              </Link>
              <div style={{ marginTop: '1.2rem' }}>
                <a
                  href="https://www.linkedin.com/company/extellsystems/?viewAsMember=true"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="ExTell on LinkedIn"
                  style={{ color: MUTED, display: 'inline-block', transition: 'opacity 0.15s' }}
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            {/* ── Site Map + Company inline (2-col sub-grid) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

              {/* Site Map */}
              <div>
                <p style={{ marginBottom: '1rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED }}>
                  Site Map
                </p>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <Link href="/" style={{ fontSize: '0.85rem', color: MUTED, textDecoration: 'none' }}>Homepage</Link>
                  {categories.map((cat) => (
                    <Link key={cat.slug} href={`/products?category=${cat.slug}`} style={{ fontSize: '0.85rem', color: MUTED, textDecoration: 'none' }}>
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/products" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
                    All Products →
                  </Link>
                </nav>
              </div>

              {/* Company */}
              <div>
                <p style={{ marginBottom: '1rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED }}>
                  Company
                </p>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {companyLinks.map((link) => (
                    <Link key={link.href} href={link.href} style={{ fontSize: '0.85rem', color: MUTED, textDecoration: 'none' }}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* ── Contact Us ── */}
            <div>
              <p style={{ marginBottom: '1rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: RED }}>
                Contact Us
              </p>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, borderRadius: 8, padding: 4, background: 'rgba(255,255,255,0.05)' }}>
                {offices.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setActiveTab(o.id)}
                    style={{
                      flex: 1, borderRadius: 6, padding: '0.35rem 0',
                      fontSize: '0.72rem', fontWeight: 600,
                      border: 0, cursor: 'pointer', transition: 'background 0.15s',
                      ...(activeTab === o.id
                        ? { background: RED, color: '#fff' }
                        : { background: 'transparent', color: MUTED }),
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Office detail */}
              <div style={{ marginTop: 10, borderRadius: 12, padding: '0.9rem 1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ marginBottom: 10, fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{active.label}</p>
                {active.phone && (
                  <a href={active.phoneLink} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7, fontSize: '0.82rem', color: MUTED, textDecoration: 'none' }}>
                    <Phone size={11} style={{ color: RED, flexShrink: 0 }} />
                    {active.phone}
                  </a>
                )}
                <a href={`mailto:${active.email}`} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: MUTED, textDecoration: 'none', wordBreak: 'break-all' }}>
                  <Mail size={11} style={{ color: RED, flexShrink: 0 }} />
                  {active.email}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile fallback styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .footer-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>

      {/* ── Red bottom bar ── */}
      <div style={{ background: RED }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0.7rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 500, color: '#fff', margin: 0 }}>
            Copyright © {new Date().getFullYear()}, extellsystems.com. All Rights Reserved.
            &nbsp;·&nbsp; Created by <strong>Geode Tech</strong>
          </p>
        </div>
      </div>

    </footer>
  );
}
