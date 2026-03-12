import aboutBackground from '../assets/about.jpg';

function AboutPage() {
  const strengths = [
    'Power Backup Solutions for mission-critical uptime',
    'ICT and Networking product ecosystem',
    'Competitive value-based manufacturing approach',
    'Supply chain simplification and delivery efficiency',
    'High interoperability and flexible architecture',
    'Lifecycle support from planning to deployment'
  ];

  const offices = [
    { country: 'USA', detail: 'Sales and strategic account support' },
    { country: 'UAE', detail: 'Regional operations and distribution hub' },
    { country: 'India', detail: 'Engineering, sourcing, and execution support' }
  ];

  return (
    <section className="overflow-hidden">
      <div
        className="about-hero relative border-b ui-border"
        style={{
          backgroundImage: `url(${aboutBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="ui-hero-overlay-strong absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="text-sm ui-text-muted">About Us</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight ui-text md:text-5xl">
            <span className="text-[#ff304a]">Global Clients</span>
            <br />
            World Class Projects
          </h1>
          <p className="mt-5 max-w-3xl text-lg ui-text md:text-2xl">
            Office Locations <span className="text-[#ff304a]">USA, UAE</span> and{' '}
            <span className="text-[#ff304a]">India</span>
          </p>
          <a
            href="/contact"
            className="ui-border ui-text ui-focus-ring mt-8 inline-flex rounded-full border px-8 py-3 text-lg font-semibold transition hover:border-[#ff304a] hover:text-[#ff304a]"
          >
            Contact Us
          </a>
        </div>
      </div>

      <div className="ui-bg-soft">
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="space-y-6 text-base leading-relaxed ui-text-muted md:text-lg">
            <p className="text-base leading-relaxed md:text-[1 rem] md:leading-snug">
              ExTell Systems is an international Power Backup Solutions and ICT manufacturer with
              office locations in USA, UAE and India. We are positioned as a competitive,
              value-based manufacturer of high quality IT Networking Products and Energy Solutions
              with a focus on providing solutions that meet real market requirements.
            </p>
            <p className="text-base leading-relaxed md:text-[1 rem] md:leading-snug">
              By simplifying the supply chain and bringing much-needed execution efficiency, we
              work closely with our clients to provide everything needed to build resilient and
              reliable Network and Data Center Infrastructure.
            </p>
            <p className="text-base leading-relaxed md:text-[1rem] md:leading-snug">
              Our competitive solutions serve small, medium, and enterprise markets, and have been
              recognized for quality, reliability, and innovation. Our product portfolio delivers
              broad interoperability, strong feature depth, flexibility for different project
              scales, and long-term value.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="ui-surface-2 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold ui-text md:text-3xl">
              What We Deliver
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {strengths.map((item) => (
                <article
                  key={item}
                  className="ui-surface-1 rounded-xl p-4 text-sm font-medium ui-text-muted md:text-base"
                >
                  {item}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="ui-surface-2 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold ui-text md:text-3xl">Global Presence</h2>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed ui-text-muted md:text-base">
              Our teams across USA, UAE, and India collaborate to provide strategic guidance,
              responsive operations, and execution support for regional and global projects.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {offices.map((office) => (
                <article
                  key={office.country}
                  className="ui-surface-1 rounded-xl p-4"
                >
                  <h3 className="text-lg font-semibold text-[#ff4b64]">{office.country}</h3>
                  <p className="mt-2 text-sm ui-text-muted">{office.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 md:pb-16">
          <div className="ui-surface-2 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold ui-text md:text-3xl">Why Clients Work with ExTell</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed ui-text-muted md:text-base">
              <p>
                We combine product quality with practical implementation thinking. This allows us
                to support projects from concept to operation with fewer integration gaps and better
                long-term outcomes.
              </p>
              <p>
                Our approach is focused on measurable performance: uptime, power quality, scalability,
                operational simplicity, and lifecycle reliability. We prioritize real-world project
                needs over one-size-fits-all solutions.
              </p>
              <p>
                Whether the requirement is ICT backbone reliability, data center resilience, or
                power backup continuity, ExTell brings technical depth, supply confidence, and
                execution discipline to every engagement.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default AboutPage;

