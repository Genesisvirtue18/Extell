import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import bgOne from '../assets/bg-1.jpg';

function SolutionsPage() {
  const solutions = useMemo(
    () => [
      {
        slug: 'modular-ups',
        menuLabel: 'Modular UPS Solutions',
        title: 'Modular UPS Solutions',
        heroTag: 'Solutions',
        subtitle: 'High quality premium modular UPS architecture for scalable critical power.',
        heroImage: bgOne,
        intro: [
          'ExTell Modular UPS Solutions range from compact modular systems to large modular plants with flexible power module combinations.',
          'With hot-swappable modules and true N+N/N+1 design options, clients can scale protection without large redesign cycles.'
        ],
        highlights: [
          'Scalability from small deployments to large enterprise requirements.',
          'Hot-swappable modules reduce maintenance downtime.',
          'High efficiency operation designed for lower power consumption.',
          'N+1 and N+N redundancy options for mission critical uptime.',
          'Compact, high power-density footprint for space saving deployments.'
        ],
        closing:
          'ExTell Modular UPS solutions are widely deployed across data centers, telecom networks, banking infrastructure, and industrial automation facilities.'
      },
      {
        slug: 'industrial-ups',
        menuLabel: 'Industrial UPS Solutions',
        title: 'Industrial UPS Solutions',
        heroTag: 'Solutions',
        subtitle: 'Heavy-duty UPS systems designed for harsh and demanding environments.',
        heroImage: bgOne,
        intro: [
          'ExTell Industrial UPS systems are engineered to protect critical machinery and control systems where power disturbances can stop operations.',
          'Designed for rugged conditions, they support high temperature, dust, humidity, vibration, and electrical noise environments.'
        ],
        highlights: [
          'Wide capacity range from 1kVA to utility-scale systems.',
          'Extended runtime through large VRLA or lithium backup banks.',
          'Parallel scalability for future growth.',
          'Power conditioning against surges, spikes, and harmonics.',
          'Rugged cabinet design for industrial operation.',
          'Built-in redundancy options for high availability.'
        ],
        closing:
          'Industrial UPS deployments are suitable for oil and gas, utilities, manufacturing, transportation, healthcare, and telecom operations.'
      },
      {
        slug: 'enterprise-scs',
        menuLabel: 'Enterprise Grade SCS Solutions',
        title: 'Enterprise Grade SCS Solutions',
        heroTag: 'Solutions',
        subtitle: 'Structured cabling systems built for organized, scalable enterprise infrastructure.',
        heroImage: bgOne,
        intro: [
          'Cabling is the foundation of modern infrastructure. ExTell SCS solutions help create standardized, compliant, and easy-to-maintain network architecture.',
          'Our solutions cover patching, distribution frames, racks, and cable management aligned with international structured cabling practices.'
        ],
        highlights: [
          'Entrance Facility (EF): service provider handoff and protection.',
          'Equipment Room (ER): core switches, servers, and backbone distribution.',
          'Backbone Cabling: interconnects between ER, TR/TE, and telecom spaces.',
          'Telecommunications Room/Enclosure (TR/TE): floor-level cross-connect zones.',
          'Horizontal Cabling: telecom room to user work areas.',
          'Work Area (WA): user outlets, patching, and endpoint connectivity.',
          'Cabling and Connection Hardware: patch panels, patch cords, racks, and cable management.'
        ],
        closing:
          'ExTell enterprise SCS solutions are standards-compliant and designed for long lifecycle reliability in commercial and institutional environments.'
      },
      {
        slug: 'solar',
        menuLabel: 'Solar Solutions',
        title: 'Solar Solutions',
        heroTag: 'Solutions',
        subtitle: 'On-grid and off-grid solar ecosystems designed for reliable clean energy.',
        heroImage: bgOne,
        intro: [
          'ExTell offers solar solutions with flexible capacity choices for residential, commercial, and industrial applications.',
          'Our team supports design, installation, and maintenance models through authorized execution partners.'
        ],
        highlights: [
          'On-grid and off-grid system options.',
          'Capacity planning based on project demand profile.',
          'Support for rooftop and large-field deployments.',
          'Integrated design and execution assistance.',
          'Operation and maintenance support lifecycle.'
        ],
        closing:
          'For upcoming projects, clients can explore compatible products and engage ExTell for end-to-end design and deployment guidance.'
      }
    ],
    []
  );

  const [activeSlug, setActiveSlug] = useState(solutions[0].slug);
  const activeSolution = solutions.find((item) => item.slug === activeSlug) || solutions[0];

  return (
    <>
   

      <section className="solutions-shell solutions-unified m-6 overflow-hidden rounded-md border border-white/10">
        <div className="solutions-layout">
          <aside className="solutions-menu">
            <p>SOLUTIONS</p>
            {solutions.map((item) => (
              <button
              key={item.slug}
              type="button"
              onClick={() => setActiveSlug(item.slug)}
              className={item.slug === activeSlug ? 'active' : ''}
            >
              {item.menuLabel}
            </button>
          ))}
        </aside>

        <article className="solutions-display">
          <header
            className="solutions-display-hero"
            style={{ backgroundImage: `url(${activeSolution.heroImage})` }}
          >
            <div className="solutions-display-overlay">
              <p>{activeSolution.heroTag}</p>
              <h1>{activeSolution.title}</h1>
              <h2>{activeSolution.subtitle}</h2>
              <Link to="/products">Product Catalog</Link>
            </div>
          </header>

          <div className="solutions-display-body">
            {activeSolution.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <h3>Key Highlights</h3>
            <ul>
              {activeSolution.highlights.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <p>{activeSolution.closing}</p>
          </div>
        </article>
      </div>
    </section>
    </>
  );
}

export default SolutionsPage;
