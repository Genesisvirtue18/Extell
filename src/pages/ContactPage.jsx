import PageHero from '../components/ui/PageHero';
import contactHero from '../assets/contact.png';
import contactFormImage from '../assets/contactform.png';

function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Sales & Engineering"
        description="Tell us your infrastructure scope. Our team will align the right catalog and deployment strategy."
        heroImage={contactHero}
        disableOverlay
      />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="grid items-stretch md:grid-cols-2">
            <div className="relative min-h-[280px] overflow-hidden md:min-h-0">
              <img
                src={contactFormImage}
                alt="Contact Form Visual"
                className="absolute h-full w-full object-cover object-center"
              />
            </div>
            <form className="grid h-full gap-4 p-6 md:grid-cols-2 md:p-8">
              <input className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Full name" required />
              <input className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Company" required />
              <input type="email" className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Business email" required />
              <input className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Phone" />
              <textarea className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy md:col-span-2" rows="5" placeholder="Project requirements" required />
              <button className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white md:col-span-2">Submit Inquiry</button>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.5fr,1fr]">
          <div className="relative h-[420px] overflow-hidden rounded-xl border border-white/10 bg-white/5 md:h-[520px]">
            <iframe
              title="Extell Office Locations Map"
              src="https://www.google.com/maps/d/embed?mid=10sCdNRQ9w6wJq-Bt0SE711ckLhbeyC8&ehbc=2E312F"
              className="absolute left-0 w-full border-0"
              style={{ top: '-140px', height: 'calc(100% + 140px)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <aside className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-3xl font-semibold text-accent">Our Offices</h2>

            <div className="mt-6 space-y-8 text-neutral-200">
              <div>
                <h3 className="text-3xl font-semibold text-neutral-100">US</h3>
                <p className="mt-3 text-lg">Phone: +1 365 889 5555</p>
                <p className="text-lg">
                  Email:{' '}
                  <a className="text-neutral-100 hover:text-accent" href="mailto:sales@extellsystems.com">
                    sales@extellsystems.com
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-semibold text-neutral-100">UAE</h3>
                <p className="mt-3 text-lg">Phone: +971 6 779 4299</p>
                <p className="text-lg">
                  Email:{' '}
                  <a className="text-neutral-100 hover:text-accent" href="mailto:sales.imea@extellsystems.com">
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
