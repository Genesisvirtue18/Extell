'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories } from '../../data/siteData';

const logo = '/assets/logo.png';
const logoWhite = '/assets/logowhite.jpg';

const contactTabs = [
  {
    id: 'us',
    label: 'US',
    phone: '+1 365 889 5555',
    phoneLink: 'tel:+13658895555',
    email: 'sales@extellsystems.com',
  },
  {
    id: 'uae',
    label: 'UAE',
    phone: '+971 6 779 4299',
    phoneLink: 'tel:+97167794299',
    email: 'sales.imea@extellsystems.com',
  },
  {
    id: 'bahrain',
    label: 'Bahrain',
    phone: '+973 3883 5435',
    phoneLink: 'tel:+97338835435',
    email: 'sales.imea@extellsystems.com',
  },
];

export default function Footer({
  theme = 'light',
}) {
  const [activeTab, setActiveTab] =
    useState('us');

  const activeContact =
    contactTabs.find(
      (tab) => tab.id === activeTab
    ) || contactTabs[0];

  const isDark =
    theme === 'dark';

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark
          ? 'border-slate-800 bg-[#060816]'
          : 'border-slate-200 bg-white'
      }`}
    >
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid items-start gap-14 md:grid-cols-3">
          {/* LEFT COLUMN */}
          <div>
            <img
              src={
                isDark
                  ? logo
                  : logoWhite
              }
              alt="Extell Systems"
              className="h-10 w-auto object-contain"
            />

            <p
              className={`mt-5 max-w-sm text-sm leading-7 ${
                isDark
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              Enterprise-grade power
              electronics, ICT
              infrastructure, and
              scalable data center
              solutions partner
              delivering modern
              enterprise technology
              worldwide.
            </p>

            {/* QUICK LINKS */}
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#ed2125]">
                Quick Links
              </h3>

              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {[
                  {
                    label: 'Home',
                    href: '/',
                  },
                  {
                    label: 'Products',
                    href: '/products',
                  },
                  {
                    label: 'Solutions',
                    href: '/solutions',
                  },
                  {
                    label: 'Support',
                    href: '/support',
                  },
                  {
                    label: 'About',
                    href: '/about',
                  },
                  {
                    label: 'Contact',
                    href: '/contact',
                  },
                  {
                    label: 'Sitemap.xml',
                    href: '/sitemap.xml',
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition hover:text-[#ed2125] ${
                      isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN */}
          <div className="md:mx-auto">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#ed2125]">
              Products
            </h3>

            <div className="grid gap-3 text-sm">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className={`transition hover:text-[#ed2125] ${
                    isDark
                      ? 'text-slate-400'
                      : 'text-slate-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/products"
                className={`transition hover:text-[#ed2125] ${
                  isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                All Products
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#ed2125]">
              Contact
            </h3>

            {/* TABS */}
            <div
              className={`inline-flex rounded-xl p-1 ${
                isDark
                  ? 'bg-slate-900'
                  : 'bg-slate-100'
              }`}
            >
              {contactTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab ===
                    tab.id
                      ? 'bg-[#ed2125] text-white shadow-lg'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* CONTACT CARD */}
            <div
              className={`mt-6 rounded-2xl border p-6 transition ${
                isDark
                  ? 'border-slate-800 bg-slate-900'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <h4
                className={`text-2xl font-bold ${
                  isDark
                    ? 'text-white'
                    : 'text-slate-900'
                }`}
              >
                {
                  activeContact.label
                }
              </h4>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#ed2125]">
                    Phone
                  </p>

                  <a
                    href={
                      activeContact.phoneLink
                    }
                    className={`text-lg transition hover:text-[#ed2125] ${
                      isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {
                      activeContact.phone
                    }
                  </a>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#ed2125]">
                    Email
                  </p>

                  <a
                    href={`mailto:${activeContact.email}`}
                    className={`break-all text-lg transition hover:text-[#ed2125] ${
                      isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {
                      activeContact.email
                    }
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className={`border-t ${
          isDark
            ? 'border-slate-800'
            : 'border-slate-200'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-sm md:flex-row">
          <p
            className={
              isDark
                ? 'text-slate-500'
                : 'text-slate-500'
            }
          >
            ©{' '}
            {new Date().getFullYear()}{' '}
            Extell Systems. All rights
            reserved.
          </p>

          <p
            className={
              isDark
                ? 'text-slate-500'
                : 'text-slate-500'
            }
          >
            Developed by{' '}
            <a
              href="https://www.genesisvirtue.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#ed2125] transition hover:underline"
            >
              Genesis Virtue
            </a>{' '}
            with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}