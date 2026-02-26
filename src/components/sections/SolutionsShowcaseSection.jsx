import SectionHeader from '../ui/SectionHeader';
import { partnerLogos } from '../../data/siteData';

function SolutionsShowcaseSection() {
  const solutions = ['Core Network Rollouts', 'Edge Data Center Enablement', 'Critical Power Modernization', 'Fiber Capacity Expansion'];
  const industries = ['Telecom', 'Oil & Gas', 'Banking', 'Government', 'Manufacturing', 'Cloud'];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeader eyebrow="Solutions" title="Deployment-ready Solution Stacks" subtitle="Integrated hardware, engineering, and support for national-scale projects." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="tech-panel red-wash rounded-xl p-6">
          <h3 className="accent-title text-xl font-bold">Solution Showcase</h3>
          <ul className="mt-4 space-y-3 text-slate-200">
            {solutions.map((solution) => <li key={solution}>- {solution}</li>)}
          </ul>
        </div>
        <div className="tech-panel red-wash rounded-xl p-6">
          <h3 className="accent-title text-xl font-bold">Industry Sectors</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <span key={industry} className="rounded-full border border-white/20 bg-accent/10 px-3 py-1 text-sm text-slate-100 hover:border-accent/70">{industry}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 via-accent/10 to-white/5 p-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-electric">Technology Partners</p>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partnerLogos.map((logo) => (
            <div key={logo} className="rounded-md border border-white/10 bg-navy/70 py-3 text-center text-sm font-semibold text-slate-200">{logo}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionsShowcaseSection;
