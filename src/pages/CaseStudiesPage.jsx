'use client';


import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';

const placeholderImage = '/assets/placeholder-tech.svg';
function CaseStudiesPage() {
  const projects = [
    { title: 'NATIONAL DATA CENTER INFRASTRUCTURE UPGRADE', tag: 'TELECOM', region: 'NORTH AMERICA' },
    { title: 'OFF-GRID SOLAR STORAGE FOR MINING OPS', tag: 'MINING & INDUSTRIAL', region: 'AUSTRALIA' },
    { title: 'SMART CITY ICT BACKBONE IMPLEMENTATION', tag: 'GOVERNMENT', region: 'EUROPE' },
    { title: '5G NETWORK EXPANSION', tag: 'TELECOM', region: 'ASIA PACIFIC' },
    { title: 'HYPERSCALE COOLING SOLUTION', tag: 'DATA CENTERS', region: 'MIDDLE EAST' },
    { title: 'REMOTE INDUSTRIAL POWER BACKUP', tag: 'INDUSTRIAL', region: 'SOUTH AMERICA' }
  ];

  return (
    <section className="case-shell mx-auto mt-6 max-w-[1220px] overflow-hidden rounded-md border border-white/10">
      <header className="case-hero">
        <h1>
          ENGINEERING
          <br />
          EXCELLENCE
          <br />
          <span>IN ACTION</span>
        </h1>
        <p>
          Explore how Extell Systems empowers global enterprises with robust power electronics
          and mission-critical ICT infrastructure solutions.
        </p>
        <div className="case-hero-actions">
          <Link href="/contact">VIEW LATEST PROJECTS</Link>
          <Link href="/downloads">DOWNLOAD PORTFOLIO -&gt;</Link>
        </div>
      </header>

      <div className="case-controls">
        <div className="case-filters">
          <button type="button">
            INDUSTRY
            <ChevronDown size={13} />
          </button>
          <button type="button">
            SOLUTION TYPE
            <ChevronDown size={13} />
          </button>
          <button type="button">
            REGION
            <ChevronDown size={13} />
          </button>
          <button type="button" className="case-reset">
            RESET FILTERS
          </button>
        </div>
        <label className="case-search">
          <Search size={14} />
          <input type="text" placeholder="Search case studies..." />
        </label>
      </div>

      <div className="case-grid">
        {projects.map((item) => (
          <article key={item.title} className="case-card">
            <img src={placeholderImage} alt={item.title} />
            <div className="case-overlay">
              <div className="case-tags">
                <span>{item.tag}</span>
                <span>{item.region}</span>
              </div>
              <p>{item.title}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="case-load-wrap">
        <button type="button">
          LOAD MORE PROJECTS
          <ChevronDown size={13} />
        </button>
      </div>

      <section className="case-cta">
        <h2>
          READY TO UPGRADE YOUR
          <br />
          INFRASTRUCTURE?
        </h2>
        <p>
          Contact our engineering team to discuss how Extell Systems
          can empower your next project.
        </p>
        <div>
          <Link href="/contact">GET A QUOTE</Link>
          <Link href="/contact">CONTACT SALES -&gt;</Link>
        </div>
      </section>
    </section>
  );
}

export default CaseStudiesPage;
