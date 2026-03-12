function TrustBadges() {
  const badges = ['ISO 9001', 'IEC Compliant', 'UL Certified', '24/7 Support'];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge} className="ui-surface-1 rounded-lg p-4 text-center text-sm font-semibold ui-text">
          {badge}
        </div>
      ))}
    </div>
  );
}

export default TrustBadges;
