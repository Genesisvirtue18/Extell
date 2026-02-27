import PageHero from '../components/ui/PageHero';

function PartnerPage() {
  const benefits = ['Co-marketing resources', 'Solution certification track', 'Regional lead sharing', 'Dedicated channel success manager'];

  return (
    <>
      <PageHero title="Partner Program" description="Collaborate with Extell to deliver high-value enterprise infrastructure outcomes." />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-lg border border-white/10 bg-white/5 p-5 text-neutral-100">{benefit}</div>
          ))}
        </div>
      </section>
    </>
  );
}

export default PartnerPage;
