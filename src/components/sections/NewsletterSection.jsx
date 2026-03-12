function NewsletterSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="ui-surface-2 rounded-2xl p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed2125]">Newsletter</p>
        <h3 className="mt-3 text-2xl font-bold ui-text">Receive Catalog Updates and Technical Briefs</h3>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Corporate email"
            className="ui-input ui-focus-ring flex-1 rounded-lg px-4 py-3 text-sm outline-none"
          />
          <button className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterSection;
