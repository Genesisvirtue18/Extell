import SectionHeader from '../ui/SectionHeader';
import TrustBadges from '../ui/TrustBadges';
import { testimonials } from '../../data/siteData';

function TrustAndTestimonialsSection() {
  return (
    <section className="bg-gradient-to-b from-navy/60 via-navy/75 to-navy/70 py-16">
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <div>
          <SectionHeader eyebrow="Trust" title="Compliance and Enterprise Credibility" />
          <TrustBadges />
        </div>
        <div>
          <SectionHeader eyebrow="Voices" title="Client Testimonials" />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote key={item.author} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-accent/10 p-6 text-slate-100">
                <p className="text-base">"{item.quote}"</p>
                <footer className="mt-4 text-sm text-electric">{item.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustAndTestimonialsSection;
