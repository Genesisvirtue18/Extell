import PageHero from '../components/ui/PageHero';

function IndustrySolutionsPage() {
  const industries = [
    { name: 'Telecom', value: 'Backbone upgrades, GPON readiness, and edge resilience.' },
    { name: 'Banking', value: 'Secure branch connectivity with mission-critical uptime power.' },
    { name: 'Government', value: 'Standards-driven infrastructure for public network modernization.' },
    { name: 'Manufacturing', value: 'Industrial Ethernet and controlled-power environments.' }
  ];

  return (
    <>
      <PageHero title="Industry-Specific Architectures" description="Blueprinted offerings tailored to high-impact sectors and operational constraints." />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((item) => (
            <div key={item.name} className="ui-surface-1 rounded-xl p-6">
              <h2 className="text-xl font-bold ui-text">{item.name}</h2>
              <p className="mt-2 text-sm ui-text-muted">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default IndustrySolutionsPage;
