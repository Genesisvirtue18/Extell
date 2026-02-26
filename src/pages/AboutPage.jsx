import PageHero from '../components/ui/PageHero';

function AboutPage() {
  return (
    <>
      <PageHero title="About Extell Systems" description="Engineering-led distribution and solution integration partner for enterprise-critical infrastructure." />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">Mission</h2>
            <p className="mt-2 text-sm text-slate-200">Enable resilient digital infrastructure through trusted products, technical rigor, and lifecycle partnership.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white">Global Reach</h2>
            <p className="mt-2 text-sm text-slate-200">Supporting deployments and channel networks across 20+ countries with local delivery alignment.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;