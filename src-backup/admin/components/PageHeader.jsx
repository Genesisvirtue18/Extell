const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl font-semibold text-center text-gray-900">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm  text-gray-500">{subtitle}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);

export default PageHeader;
