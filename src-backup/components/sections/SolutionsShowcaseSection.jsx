import SectionHeader from '../ui/SectionHeader';
import { partnerLogos, solutionIndustries, solutionShowcaseItems } from '../../data/siteData';

function SolutionsShowcaseSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeader eyebrow="Solutions" title="Deployment-ready Solution Stacks" subtitle="Integrated hardware, engineering, and support for national-scale projects." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="tech-panel red-wash ui-surface-1 rounded-xl p-6">
          <h3 className="accent-title text-xl font-bold">Solution Showcase</h3>
          <ul className="mt-4 space-y-3 ui-text-muted">
            {solutionShowcaseItems.map((solution) => <li key={solution}>- {solution}</li>)}
          </ul>
        </div>
        <div className="tech-panel red-wash ui-surface-1 rounded-xl p-6">
          <h3 className="accent-title text-xl font-bold">Industry Sectors</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {solutionIndustries.map((industry) => (
              <span key={industry} className="ui-border ui-bg-soft rounded-full border px-3 py-1 text-sm ui-text hover:border-accent/70">{industry}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="ui-surface-2 mt-8 rounded-xl p-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#ed2125]">Technology Partners</p>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {partnerLogos.map((logo) => (
            <div key={logo} className="ui-surface-1 rounded-md py-3 text-center text-sm font-semibold ui-text">{logo}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SolutionsShowcaseSection;

