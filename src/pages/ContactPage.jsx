'use client';

import PageHero from '../components/ui/PageHero';

const contactHero = '/assets/contact.png';
const contactFormImage = '/assets/contactform.png';

function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Sales & Engineering"
        description="Tell us your infrastructure scope. Our team will align the right catalog and deployment strategy."
        heroImage={contactHero}
      />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="ui-surface-1 overflow-hidden rounded-xl">
          <div className="grid items-stretch md:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden md:min-h-0">
              <img
                src={contactFormImage}
                alt="Contact Form Visual"
                className="absolute h-full w-full object-cover object-center"
              />
            </div>
            <form className="grid h-full gap-4 p-6 md:grid-cols-2 md:p-8">
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wide ui-text-muted">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  className="ui-input ui-focus-ring rounded-md px-4 py-3 text-sm"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-company" className="text-xs font-semibold uppercase tracking-wide ui-text-muted">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  className="ui-input ui-focus-ring rounded-md px-4 py-3 text-sm"
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wide ui-text-muted">Business Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="ui-input ui-focus-ring rounded-md px-4 py-3 text-sm"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-phone" className="text-xs font-semibold uppercase tracking-wide ui-text-muted">Phone</label>
                <input
                  id="contact-phone"
                  name="phone"
                  className="ui-input ui-focus-ring rounded-md px-4 py-3 text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wide ui-text-muted">Project Requirements</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="ui-input ui-focus-ring rounded-md px-4 py-3 text-sm"
                  rows="5"
                  placeholder="Describe your infrastructure needs, scale, and timeline"
                  required
                />
              </div>
              <button
                type="submit"
                className="ui-focus-ring rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d31c20] active:scale-[0.98] md:col-span-2"
              >
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.5fr,1fr]">
          <div className="ui-surface-1 relative h-[420px] overflow-hidden rounded-xl md:h-[520px]">
            <iframe
              title="Extell Office Locations Map"
              src="https://www.google.com/maps/d/embed?mid=10sCdNRQ9w6wJq-Bt0SE711ckLhbeyC8&ehbc=2E312F"
              className="absolute left-0 w-full border-0"
              style={{ top: '-140px', height: 'calc(100% + 140px)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <aside className="ui-surface-1 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-accent">Our Offices</h2>

            <div className="mt-6 space-y-8 ui-text-muted">
              <div>
                <h3 className="text-lg font-semibold ui-text">United States</h3>
                <p className="mt-2 text-sm">
                  Email:{' '}
                  <a className="ui-text hover:text-accent" href="mailto:sales@extellsystems.com">
                    sales@extellsystems.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold ui-text">UAE — Sharjah</h3>
                <p className="mt-2 text-sm">Phone: <a href="tel:+97167794299" className="ui-text hover:text-accent">+971 6 779 4299</a></p>
                <p className="mt-1 text-sm">
                  Email:{' '}
                  <a className="ui-text hover:text-accent" href="mailto:sales.imea@extellsystems.com">
                    sales.imea@extellsystems.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold ui-text">Bahrain</h3>
                <p className="mt-2 text-sm">Phone: <a href="tel:+97338835435" className="ui-text hover:text-accent">+973 3883 5435</a></p>
                <p className="mt-1 text-sm">
                  Email:{' '}
                  <a className="ui-text hover:text-accent" href="mailto:sales.imea@extellsystems.com">
                    sales.imea@extellsystems.com
                  </a>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
