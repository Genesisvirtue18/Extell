'use client';

import { BadgeCheck, Download, Leaf, Search, ShieldCheck, Stamp } from 'lucide-react';

function CertificationsPage() {
  const filters = ['All Certifications', 'ISO Standards', 'Safety & UL', 'Environmental', 'Regional'];
  const certifications = [
    { code: 'ISO', scope: 'GLOBAL', title: 'ISO 9001:2015', note: 'Quality Management System covering consistent product quality and customer satisfaction.' },
    { code: 'ISO', scope: 'GLOBAL', title: 'ISO 14001:2015', note: 'Environmental Management System (EMS) minimizing our environmental footprint.' },
    { code: 'SAFETY', scope: 'JAPAN', title: 'UL Safety Listing', note: 'Certified for safety by independent laboratories for power electronics products.' },
    { code: 'CE', scope: 'EU', title: 'CE Declaration', note: 'Conformity with health, safety, and environmental protection standards for the EU.' },
    { code: 'EMC', scope: 'USA', title: 'FCC Part 15', note: 'Compliance with federal communications requirements for electromagnetic emissions.' },
    { code: 'SAFETY', scope: 'GLOBAL', title: 'TuV Rheinland', note: 'Technical safety and certification services for specialized industrial power systems.' }
  ];

  const initiatives = ['RoHS Compliant', 'Energy Star Partner', 'Conflict-Free'];

  return (
    <section className="cert-shell m-6  overflow-hidden rounded-md border border-white/10">
      <header className="cert-hero">
        <span className="cert-pill">OFFICIAL DOCUMENTATION</span>
        <h1>
          Global Standards &amp;
          <br />
          Regulatory Compliance
        </h1>
        <p>
          Ensuring safety, reliability, and environmental responsibility across all Extell
          power solutions. We adhere to the strictest international protocols.
        </p>
        <div className="cert-tools">
          <div className="cert-chips">
            {filters.map((item, index) => (
              <button key={item} type="button" className={index === 0 ? 'active' : ''}>
                {item}
              </button>
            ))}
          </div>
          <label className="cert-search">
            <Search size={14} />
            <input type="text" placeholder="Search ISO 9001, UL, CE..." />
          </label>
        </div>
      </header>

      <section className="cert-grid">
        {certifications.map((item, index) => (
          <article key={`${item.title}-${index}`} className="cert-card">
            <div className="cert-icon-box">
              {index % 3 === 0 ? <ShieldCheck size={24} /> : null}
              {index % 3 === 1 ? <Leaf size={24} /> : null}
              {index % 3 === 2 ? <BadgeCheck size={24} /> : null}
            </div>
            <div className="cert-meta">
              <span>{item.code}</span>
              <span>{item.scope}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.note}</p>
            <div className="cert-bottom">
              <small>Valid until Dec 2034</small>
              <button type="button">View Cert</button>
            </div>
          </article>
        ))}
      </section>

      <section className="cert-sustain">
        <div className="cert-sustain-text">
          <span>GREEN INITIATIVES</span>
          <h2>Sustainability at Extell</h2>
          <p>
            Our commitment goes beyond power efficiency. We are dedicated to responsible
            manufacturing, ethical sourcing, and reducing hazardous substances in our supply chain.
          </p>
          <div>
            {initiatives.map((item) => (
              <article key={item}>
                <Stamp size={14} />
                <strong>{item}</strong>
              </article>
            ))}
          </div>
        </div>
        <div className="cert-sustain-badge">
          <p>100%</p>
          <span>RECYCLABLE</span>
          <span>PACKAGING</span>
        </div>
      </section>

      <footer className="cert-footer">
        <div>
          <h3>Need full documentation for an audit?</h3>
          <p>Download the complete compliance package including all relevant certificates.</p>
        </div>
        <button type="button">
          <Download size={14} />
          Download All (ZIP)
        </button>
      </footer>
    </section>
  );
}

export default CertificationsPage;
