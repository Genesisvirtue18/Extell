'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle } from 'lucide-react';

const offices = [
  {
    id: 'us',
    region: 'United States',
    flag: '🇺🇸',
    role: 'Strategic Account Support',
    email: 'sales@extellsystems.com',
    color: '#3B82F6',
  },
  {
    id: 'uae',
    region: 'UAE — Sharjah',
    flag: '🇦🇪',
    role: 'Regional Operations & Distribution Hub',
    phone: '+971 6 779 4299',
    phoneLink: 'tel:+97167794299',
    email: 'sales.imea@extellsystems.com',
    color: '#ed2125',
  },
  {
    id: 'bahrain',
    region: 'Bahrain',
    flag: '🇧🇭',
    role: 'GCC Region Sales',
    phone: '+973 3883 5435',
    phoneLink: 'tel:+97338835435',
    email: 'sales.imea@extellsystems.com',
    color: '#10B981',
  },
];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#080808]">
        <div className="absolute inset-0 bg-tech-grid bg-[size:26px_26px] opacity-[0.06]" />
        <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ed2125] opacity-[0.07] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-[#ed2125] opacity-[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ed2125]">Contact Us</p>
          <h1
            className="mt-3 font-black leading-[1.08] tracking-[-0.02em] text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
          >
            Let's Build Your
            <br />
            <span className="text-[#ed2125]">Infrastructure</span> Together
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
            Tell us your scope. Our engineering and sales team will respond within 2 business hours.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ── Form ── */}
          <div className="tech-panel rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold tracking-tight text-white">Send an Inquiry</h2>
            <p className="mt-1 text-sm text-white/45">All fields marked * are required.</p>

            {submitted ? (
              <div className="mt-10 flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle size={48} className="text-[#10B981]" />
                <p className="text-lg font-bold text-white">Message Received</p>
                <p className="max-w-xs text-sm text-white/50">
                  Our team will follow up within 2 business hours. Check your inbox for a confirmation.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm font-semibold text-[#ed2125] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-name" className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/40">
                    Full Name *
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    required
                    placeholder="John Smith"
                    className="contact-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-company" className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/40">
                    Company *
                  </label>
                  <input
                    id="c-company"
                    name="company"
                    required
                    placeholder="Acme Corporation"
                    className="contact-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-email" className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/40">
                    Business Email *
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="contact-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-phone" className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/40">
                    Phone
                  </label>
                  <input
                    id="c-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="contact-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="c-country" className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/40">
                    Country / Region
                  </label>
                  <input
                    id="c-country"
                    name="country"
                    placeholder="UAE, India, Bahrain, USA…"
                    className="contact-input"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="c-message" className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white/40">
                    Project Requirements *
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your infrastructure needs — product type, scale, timeline, and site location."
                    className="contact-input resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ed2125] py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_28px_rgba(237,33,37,0.35)] transition hover:bg-[#d91f23] hover:shadow-[0_12px_36px_rgba(237,33,37,0.45)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#ed2125]/50 focus:ring-offset-2 focus:ring-offset-[#111]"
                  >
                    Submit Inquiry
                    <ArrowRight size={16} />
                  </button>
                  <p className="mt-3 text-center text-[0.7rem] text-white/30">
                    We respond within 2 business hours · No spam, ever
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── Office cards ── */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold uppercase tracking-[0.12em] text-white/40">Our Offices</h2>

            {offices.map((office) => (
              <div
                key={office.id}
                className="tech-panel group rounded-2xl p-5 transition hover:border-white/20"
                style={{ borderLeft: `3px solid ${office.color}` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={office.region}>{office.flag}</span>
                  <div>
                    <p className="font-bold text-white">{office.region}</p>
                    <p className="text-xs text-white/40">{office.role}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  {office.phone && (
                    <a
                      href={office.phoneLink}
                      className="flex items-center gap-2.5 text-sm text-white/60 transition hover:text-white"
                    >
                      <Phone size={13} className="shrink-0" style={{ color: office.color }} />
                      {office.phone}
                    </a>
                  )}
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-2.5 text-sm text-white/60 transition hover:text-white"
                  >
                    <Mail size={13} className="shrink-0" style={{ color: office.color }} />
                    {office.email}
                  </a>
                </div>
              </div>
            ))}

            {/* Quick contact links */}
            <div className="tech-panel rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#ed2125]">Direct Channels</p>
              <div className="mt-3 space-y-2">
                <a
                  href="mailto:sales@extellsystems.com"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#ed2125]/40 hover:text-[#ed2125]"
                >
                  <span>Sales Team</span>
                  <ArrowRight size={14} />
                </a>
                <a
                  href="mailto:support@extellsystems.com"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#ed2125]/40 hover:text-[#ed2125]"
                >
                  <span>Technical Support</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10" style={{ height: 420 }}>
          <iframe
            title="Extell Office Locations Map"
            src="https://www.google.com/maps/d/embed?mid=10sCdNRQ9w6wJq-Bt0SE711ckLhbeyC8&ehbc=2E312F"
            className="h-full w-full border-0"
            style={{ marginTop: '-120px', height: 'calc(100% + 120px)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

export default ContactPage;
