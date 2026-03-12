function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? <p className="accent-chip mb-2 text-xs font-semibold uppercase tracking-[0.22em]">{eyebrow}</p> : null}
      <h2 className="  text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-sm ui-text-muted md:text-base">{subtitle}</p> : null}
    </div>
  );
}

export default SectionHeader;

