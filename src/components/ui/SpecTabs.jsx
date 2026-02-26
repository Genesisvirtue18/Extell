import { useState } from 'react';

const tabs = ['Specifications', 'Features', 'Downloads'];

function SpecTabs({ product }) {
  const [active, setActive] = useState('Specifications');

  return (
    <div className="rounded-xl border border-white/10 bg-navy/70 p-6">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-md px-4 py-2 text-sm ${active === tab ? 'bg-electric text-white' : 'bg-white/10 text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="pt-4 text-sm text-slate-200">
        {active === 'Specifications' ? (
          Object.entries(product.specs).map(([key, value]) => <p key={key}><span className="font-semibold">{key}:</span> {value}</p>)
        ) : null}
        {active === 'Features' ? <p>Hot-swappable modules, enterprise monitoring, and high-availability design for 24/7 operations.</p> : null}
        {active === 'Downloads' ? <p>Datasheet, install guide, and compliance declarations are available in the Downloads section.</p> : null}
      </div>
    </div>
  );
}

export default SpecTabs;