import PageHero from '../components/ui/PageHero';

function ContactPage() {
  return (
    <>
      <PageHero title="Contact Sales & Engineering" description="Tell us your infrastructure scope. Our team will align the right catalog and deployment strategy." />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <form className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <input className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Full name" required />
          <input className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Company" required />
          <input type="email" className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Business email" required />
          <input className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy" placeholder="Phone" />
          <textarea className="rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy md:col-span-2" rows="5" placeholder="Project requirements" required />
          <button className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white md:col-span-2">Submit Inquiry</button>
        </form>
      </section>
    </>
  );
}

export default ContactPage;