import PageHero from '../components/ui/PageHero';

function CareersPage() {
  const roles = ['Pre-Sales Engineer - Power Systems', 'Network Solutions Architect', 'Channel Partnership Manager'];

  return (
    <>
      <PageHero title="Careers" description="Join a team shaping mission-critical infrastructure programs across regions." />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4">
          {roles.map((role) => (
            <div key={role} className="ui-surface-1 rounded-lg p-5">
              <h2 className="text-lg font-semibold ui-text">{role}</h2>
              <button className="ui-surface-1 ui-text mt-3 rounded-md px-4 py-2 text-xs font-semibold">Apply Now</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default CareersPage;
