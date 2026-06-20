'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categories } from '../../data/siteData';

const logo = '/assets/logo.png';
const logoWhite = '/assets/logowhite.jpg';

const contactTabs = [
  {
    id: 'us',
    label: 'US',
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

export default function Footer({ theme = 'light' }) {
  const [activeTab, setActiveTab] = useState('us');

  const activeContact =
    contactTabs.find((tab) => tab.id === activeTab) || contactTabs[0];

  const isDark = theme === 'dark';

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark
          ? 'border-slate-800 bg-[#060816]'
          : 'border-slate-200 bg-white'
      }`}
    >
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid gap-12 sm:gap-14 md:grid-cols-2 lg:grid-cols-3">

          {/* LEFT */}
          <div>
            <Image
              src={isDark ? logoWhite : logo}
              alt="ExTell Systems"
              width={160}
              height={40}
              className="h-9 sm:h-10 w-auto object-contain"
            />

            <p
              className={`mt-4 sm:mt-5 max-w-sm text-sm leading-6 sm:leading-7 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Enterprise-grade power electronics, ICT infrastructure, and
              scalable data center solutions partner delivering modern
              enterprise technology worldwide.
            </p>

            {/* QUICK LINKS */}
            <div className="mt-6 sm:mt-8">
              <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#ed2125]">
                Quick Links
              </h3>

              <div className="grid grid-cols-2 gap-y-2 sm:gap-y-3 text-sm">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Products', href: '/products' },
                  { label: 'Solutions', href: '/solutions' },
                  { label: 'Support', href: '/support' },
                  { label: 'About', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Sitemap.xml', href: '/sitemap.xml' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition hover:text-[#ed2125] ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div>
            <h3 className="mb-4 sm:mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#ed2125]">
              Products
            </h3>

            <div className="grid gap-2 sm:gap-3 text-sm">
                {categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products?category=${item.slug}`}
                    className={`transition hover:text-[#ed2125] ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/products"
                className={`transition hover:text-[#ed2125] ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                All Products
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <h3 className="mb-4 sm:mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#ed2125]">
              Contact
            </h3>

            {/* Tabs */}
            <div
              className={`flex overflow-x-auto no-scrollbar rounded-xl p-1 ${
                isDark ? 'bg-slate-900' : 'bg-slate-100'
              }`}
            >
              {contactTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-[#ed2125] text-white shadow'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contact Card */}
            <div
              className={`mt-5 sm:mt-6 rounded-xl sm:rounded-2xl border p-4 sm:p-6 ${
                isDark
                  ? 'border-slate-800 bg-slate-900'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <h4
                className={`text-xl sm:text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {activeContact.label}
              </h4>

              <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#ed2125]">
                    Email
                  </p>
                  <a
                    href={`mailto:${activeContact.email}`}
                    className={`block mt-1 text-base sm:text-lg break-all ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    } hover:text-[#ed2125]`}
                  >
                    {activeContact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        className={`border-t ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Extell Systems. All rights reserved.
          </p>

          <p className="text-center md:text-right">
            Developed by{' '}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#ed2125] hover:underline"
            >
              Zoed Tech
            </a>{' '}
            with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
