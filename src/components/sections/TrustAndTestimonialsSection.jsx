import SectionHeader from '../ui/SectionHeader';
import TrustBadges from '../ui/TrustBadges';
import { publicReviewSnapshots, testimonials } from '../../data/siteData';

function TrustAndTestimonialsSection() {
  return (
    <section className="bg-gradient-to-b from-black/60 via-black/75 to-black/70 py-16">
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <div>
          <SectionHeader eyebrow="Trust" title="Compliance and Enterprise Credibility" />
          <TrustBadges />
        </div>
        <div>
          <SectionHeader eyebrow="Voices" title="Client Testimonials" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.author} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-accent/10 p-6 text-neutral-100">
                <p className="text-base">"{item.quote}"</p>
                <footer className="mt-4 text-sm text-[#ed2125]">{item.author}</footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-neutral-100">Public Review Snapshot</h3>
            <p className="mt-2 text-sm text-neutral-300">
              External ratings pulled from public listing pages. Open source links for latest live reviews.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {publicReviewSnapshots.map((item) => (
                <article key={`${item.platform}-${item.label}`} className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-wider text-neutral-400">{item.platform}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-100">{item.label}</p>
                  {item.rating ? (
                    <p className="mt-2 text-sm text-neutral-200">
                      Rating: <span className="font-semibold text-[#ed2125]">{item.rating}/5</span>
                      {item.totalRatings ? ` (${item.totalRatings} ratings)` : ''}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-neutral-200">Open source for current rating details.</p>
                  )}
                  <p className="mt-2 text-xs text-neutral-400">{item.note}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-[#ff4a66] hover:text-[#ff6b82]"
                  >
                    View Source
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustAndTestimonialsSection;

