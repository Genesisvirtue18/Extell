import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { getProductPath } from '../../lib/productUrl';

function ProductCard({ product, onCompare }) {
  return (
    <article className="card-lift ui-surface-1 rounded-xl p-6 ui-text shadow-xl">
      <h3 className="red-edge text-lg font-bold">{product.name}</h3>
      <p className="mt-2 text-sm ui-text-muted">{product.short}</p>
      <ul className="mt-4 space-y-2 text-xs ui-text-muted">
        {Object.entries(product.specs).map(([key, value]) => (
          <li key={key} className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#ed2125]" />
            <span className="font-semibold">{key}:</span> {value}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2">
        <Link to={getProductPath(product)} className="rounded-md bg-[#ed2125] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(237,33,37,0.4)]">Details</Link>
        <button onClick={() => onCompare(product)} className="ui-border ui-text rounded-md border px-3 py-2 text-xs font-semibold hover:border-accent hover:text-accent">Compare</button>
      </div>
    </article>
  );
}

export default ProductCard;

