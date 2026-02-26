import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Globe, Leaf, ShieldCheck, Zap } from 'lucide-react';
import placeholderImage from '../assets/placeholder-tech.svg';

function SolutionsPage() {
  const applications = [
    { title: 'MOBILE 5G', text: 'Telecom-grade power systems for uninterrupted network uptime.' },
    { title: 'DATA-AGG', text: 'Compact conversion and conditioning for edge node sites.' },
    { title: 'ENTERPRISE DATA CENTERS', text: 'Resilient architectures for high-density compute environments.' },
    { title: 'HEALTHCARE', text: 'Zero-downtime backup solutions ensuring continuous operation for critical life support systems.' },
    { title: 'RENEWABLE ENERGY', text: 'Inverters and energy storage integration for large-scale solar and wind farms.' },
    { title: 'TRANSPORTATION', text: 'Robust signaling power systems and EV charging infrastructure.' }
  ];

  const stories = [
    {
      title: 'Global Telecom Provider Infrastructure Upgrade',
      tag: 'TELECOM',
      summary: 'Reduced network downtime by 99.9% across 4 regions with our bespoke hybrid power systems.'
    },
    {
      title: 'Fortune 500 HQ Energy Efficiency',
      tag: 'ENTERPRISE',
      summary: 'Implemented smart metering and load balancing, saving the client 30% in annual energy costs.'
    },
    {
      title: 'National Hospital Grid Resilience',
      tag: 'HEALTHCARE',
      summary: 'Deployed a redundant UPS architecture to ensure zero interruption during city-wide blackouts.'
    }
  ];

  return (
    <section className="solutions-shell m-6 overflow-hidden rounded-md border border-white/10">
      <div className="solutions-hero">
        <div className="solutions-hero-content">
          <p className="solutions-kicker">POWER NETWORKS</p>
          <h1>
            EMPOWERING GLOBAL
            <br />
            <span>INFRASTRUCTURE</span>
          </h1>
          <p>
            Extell Systems delivers resilient power conversion and backup architecture designed
            for mission-critical operations.
          </p>
          <div className="solutions-hero-actions">
            <Link to="/products">EXPLORE PRODUCTS</Link>
            <Link to="/industry-solutions">VIEW SOLUTIONS</Link>
          </div>
        </div>
        <div className="solutions-hero-note">
          <p>
            Delivering certified solutions across telecom, financial services, utilities,
            transportation, and public infrastructure.
          </p>
        </div>
      </div>

      <div className="solutions-section-head">
        <h2>INDUSTRY APPLICATIONS</h2>
      </div>
      <div className="solutions-grid">
        {applications.map((item) => (
          <article key={item.title} className="solution-app-card">
            <img src={placeholderImage} alt={item.title} />
            <div className="solution-app-overlay">
              <span className="solution-app-icon">
                <ShieldCheck size={12} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="solutions-section-head stories">
        <h2>SUCCESS STORIES</h2>
        <Link to="/case-studies">VIEW ALL CASES &gt;</Link>
      </div>
      <div className="solutions-stories">
        {stories.map((story) => (
          <article key={story.title} className="solution-story-card">
            <span className="solution-story-tag">{story.tag}</span>
            <img src={placeholderImage} alt={story.title} />
            <div>
              <h3>{story.title}</h3>
              <p>{story.summary}</p>
              <Link to="/case-studies">
                READ CASE STUDY
                <ArrowRight size={12} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="solutions-certs">
        <h3>CERTIFIED FOR EXCELLENCE &amp; SAFETY</h3>
        <div>
          <article>
            <ShieldCheck size={14} />
            <span>ISO 9001</span>
          </article>
          <article>
            <Zap size={14} />
            <span>IEC 62040</span>
          </article>
          <article>
            <BadgeCheck size={14} />
            <span>UL Listed</span>
          </article>
          <article>
            <Leaf size={14} />
            <span>RoHS</span>
          </article>
          <article>
            <Globe size={14} />
            <span>CE Mark</span>
          </article>
        </div>
      </section>

    
    </section>
  );
}

export default SolutionsPage;
