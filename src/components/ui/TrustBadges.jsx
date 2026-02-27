function TrustBadges() {
  const badges = ['ISO 9001', 'IEC Compliant', 'UL Certified', '24/7 Support'];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-neutral-100">
          {badge}
        </div>
      ))}
    </div>
  );
}

export default TrustBadges;
