import { Search } from 'lucide-react';

function SearchBar({ placeholder = 'Search products, models, certifications...', value = '', onChange }) {
  return (
    <label className="relative block w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ui-text-muted" size={18} />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="ui-input ui-focus-ring w-full rounded-lg py-3 pl-10 pr-4 text-sm outline-none transition"
      />
    </label>
  );
}

export default SearchBar;
