function FilterSidebar() {
  return (
    <aside className="ui-surface-2 rounded-xl p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#ed2125]">Filter Products</h3>
      <div className="mt-4 space-y-4 text-sm ui-text-muted">
        <div>
          <p className="mb-2 font-medium">Category</p>
          <label className="flex items-center gap-2"><input type="checkbox" /> Fiber</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> UPS</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Data Center</label>
        </div>
        <div>
          <p className="mb-2 font-medium">Voltage Class</p>
          <label className="flex items-center gap-2"><input type="checkbox" /> Low voltage</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Medium voltage</label>
        </div>
        <button className="ui-surface-1 ui-text w-full rounded-md px-4 py-2 text-xs font-semibold">Apply Filters</button>
      </div>
    </aside>
  );
}

export default FilterSidebar;
