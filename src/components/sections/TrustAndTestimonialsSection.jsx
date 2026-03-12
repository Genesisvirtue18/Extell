import SectionHeader from '../ui/SectionHeader';
import TrustBadges from '../ui/TrustBadges';
import { publicReviewSnapshots, testimonials } from '../../data/siteData';

function TrustAndTestimonialsSection() {
  return (
    <section className="ui-section py-16">
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <div>
          <SectionHeader eyebrow="Trust" title="Compliance and Enterprise Credibility" />
          <TrustBadges />
        </div>
        <div>
          <SectionHeader eyebrow="Voices" title="Client Testimonials" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote key={item.author} className="ui-surface-1 rounded-xl p-6 ui-text">
                <p className="text-base">"{item.quote}"</p>
                <footer className="mt-4 text-sm text-[#ed2125]">{item.author}</footer>
              </blockquote>
            ))}
          </div>
          <div className="ui-surface-2 mt-8 rounded-xl p-6">
            <h3 className="text-lg font-semibold ui-text">Public Review Snapshot</h3>
            <p className="mt-2 text-sm ui-text-muted">
              External ratings pulled from public listing pages. Open source links for latest live reviews.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {publicReviewSnapshots.map((item) => (
                <article key={`${item.platform}-${item.label}`} className="ui-surface-1 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-wider ui-text-muted">{item.platform}</p>
                  <p className="mt-1 text-sm font-semibold ui-text">{item.label}</p>
                  {item.rating ? (
                    <p className="mt-2 text-sm ui-text-muted">
                      Rating: <span className="font-semibold text-[#ed2125]">{item.rating}/5</span>
                      {item.totalRatings ? ` (${item.totalRatings} ratings)` : ''}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm ui-text-muted">Open source for current rating details.</p>
                  )}
                  <p className="mt-2 text-xs ui-text-muted">{item.note}</p>
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
