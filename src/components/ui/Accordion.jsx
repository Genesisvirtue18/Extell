import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.title} className="ui-surface-1 rounded-lg">
          <button
            className="ui-focus-ring flex w-full items-center justify-between rounded-lg px-5 py-4 text-left"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <span className="font-semibold ui-text">{item.title}</span>
            <ChevronDown className={openIndex === index ? 'rotate-180 transition' : 'transition'} size={18} />
          </button>
          {openIndex === index ? <p className="px-5 pb-4 text-sm ui-text-muted">{item.content}</p> : null}
        </div>
      ))}
    </div>
  );
}

export default Accordion;
