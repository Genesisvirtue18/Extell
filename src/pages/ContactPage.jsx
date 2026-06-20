'use client';

import { useState } from 'react';
import { Phone, Mail, ArrowRight, CheckCircle } from 'lucide-react';

const offices = [
  {
    id: 'us',
    region: 'United States',
    flag: '🇺🇸',
    role: 'Strategic Account Support',
    email: 'sales@extellsystems.com',
  },
  {
    id: 'uae',
    region: 'UAE — Sharjah',
    flag: '🇦🇪',
    role: 'Regional Operations & Distribution',
    phone: '+971 6 779 4299',
    phoneLink: 'tel:+97167794299',
    email: 'sales.imea@extellsystems.com',
  },
  {
    id: 'bahrain',
    region: 'Bahrain',
    flag: '🇧🇭',
    role: 'GCC Region Sales',
    phone: '+973 3883 5435',
    phoneLink: 'tel:+97338835435',
    email: 'sales.imea@extellsystems.com',
  },
];

/* ─── reusable input style ─────────────────────────────────────── */
const inputCls =
  'w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm transition focus:outline-none';

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="ui-bg-soft min-h-screen">
      {/* ── Page hero ── */}
      <div className="border-b ui-border px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ed2125]">Contact</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight ui-text sm:text-3xl md:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed ui-text-muted">
            Our sales and engineering team typically responds within 2 business hours.
          </p>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* ── Contact form ── */}
          <div className="ui-surface-1 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-semibold ui-text">Send an Inquiry</h2>
            <p className="mt-0.5 text-xs ui-text-muted">Fields marked * are required.</p>

            {submitted ? (
              <div className="mt-10 flex flex-col items-center gap-3 py-10 text-center">
                <CheckCircle size={40} className="text-emerald-500" />
                <p className="text-base font-semibold ui-text">Message Received</p>
                <p className="max-w-xs text-sm ui-text-muted">
                  We'll follow up within 2 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-sm font-semibold text-[#ed2125] hover:underline"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-name" className="text-[0.72rem] font-semibold ui-text-muted">
                    Full Name *
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    required
                    placeholder="John Smith"
                    className={`${inputCls} ui-input focus:ring-2 focus:ring-[#ed2125]/30`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-company" className="text-[0.72rem] font-semibold ui-text-muted">
                    Company *
                  </label>
                  <input
                    id="c-company"
                    name="company"
                    required
                    placeholder="Acme Corp"
                    className={`${inputCls} ui-input focus:ring-2 focus:ring-[#ed2125]/30`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-email" className="text-[0.72rem] font-semibold ui-text-muted">
                    Business Email *
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className={`${inputCls} ui-input focus:ring-2 focus:ring-[#ed2125]/30`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-phone" className="text-[0.72rem] font-semibold ui-text-muted">
                    Phone
                  </label>
                  <input
                    id="c-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`${inputCls} ui-input focus:ring-2 focus:ring-[#ed2125]/30`}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="c-message" className="text-[0.72rem] font-semibold ui-text-muted">
                    Project Requirements *
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your infrastructure needs — product type, scale, timeline, location."
                    className={`${inputCls} ui-input resize-none focus:ring-2 focus:ring-[#ed2125]/30`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ed2125] py-3 text-sm font-semibold text-white transition hover:bg-[#d91f23] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#ed2125]/40 focus:ring-offset-2"
                  >
                    Submit Inquiry
                    <ArrowRight size={15} />
                  </button>
                  <p className="mt-2.5 text-center text-[0.7rem] ui-text-muted">
                    We respond within 2 business hours · No spam
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── Offices ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#ed2125]">
              Our Offices
            </h2>

            {offices.map((office) => (
              <div key={office.id} className="ui-surface-1 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="text-xl" role="img" aria-label={office.region}>
                    {office.flag}
                  </span>
                  <div>
                    <p className="text-sm font-semibold ui-text">{office.region}</p>
                    <p className="text-xs ui-text-muted">{office.role}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {office.phone && (
                    <a
                      href={office.phoneLink}
                      className="flex items-center gap-2 text-sm ui-text-muted transition hover:text-[#ed2125]"
                    >
                      <Phone size={12} className="shrink-0 text-[#ed2125]" />
                      {office.phone}
                    </a>
                  )}
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-2 break-all text-sm ui-text-muted transition hover:text-[#ed2125]"
                  >
                    <Mail size={12} className="shrink-0 text-[#ed2125]" />
                    {office.email}
                  </a>
                </div>
              </div>
            ))}

            {/* Quick links */}
            <div className="ui-surface-1 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#ed2125]">
                Direct Channels
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { label: 'Sales Team', href: 'mailto:sales@extellsystems.com' },
                  { label: 'Technical Support', href: 'mailto:support@extellsystems.com' },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium ui-text ui-border transition hover:border-[#ed2125]/40 hover:text-[#ed2125]"
                  >
                    <span>{label}</span>
                    <ArrowRight size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="mt-10 overflow-hidden rounded-2xl border ui-border" style={{ height: 400 }}>
          <iframe
            title="Extell Office Locations Map"
            src="https://www.google.com/maps/d/embed?mid=10sCdNRQ9w6wJq-Bt0SE711ckLhbeyC8&ehbc=2E312F"
            className="w-full border-0"
            style={{ height: 'calc(100% + 120px)', marginTop: '-120px' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
