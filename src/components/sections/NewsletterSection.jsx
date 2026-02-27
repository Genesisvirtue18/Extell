function NewsletterSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-2xl border border-electric/40 bg-gradient-to-r from-[#121212] to-[#1c1c1c] p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed2125]">Newsletter</p>
        <h3 className="mt-3 text-2xl font-bold text-white">Receive Catalog Updates and Technical Briefs</h3>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Corporate email"
            className="flex-1 rounded-lg border border-white/20 bg-white/95 px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-[#555555]"
          />
          <button className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterSection;
