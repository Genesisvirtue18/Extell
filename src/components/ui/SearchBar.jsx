import { Search } from 'lucide-react';

function SearchBar({ placeholder = 'Search products, models, certifications...', value = '', onChange }) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/15 bg-white/95 py-3 pl-10 pr-4 text-sm text-navy outline-none ring-[#333333] transition focus:ring-2"
      />
    </label>
  );
}

export default SearchBar;
