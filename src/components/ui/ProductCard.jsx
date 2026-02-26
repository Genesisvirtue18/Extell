import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

function ProductCard({ product, onCompare }) {
  return (
    <article className="card-lift rounded-xl border border-white/10 bg-card p-6 text-navy shadow-xl">
      <h3 className="red-edge text-lg font-bold">{product.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{product.short}</p>
      <ul className="mt-4 space-y-2 text-xs text-slate-700">
        {Object.entries(product.specs).map(([key, value]) => (
          <li key={key} className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-electric" />
            <span className="font-semibold">{key}:</span> {value}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex gap-2">
        <Link to={`/product/${product.id}`} className="rounded-md bg-electric px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(31,123,255,0.4)]">Details</Link>
        <button onClick={() => onCompare(product)} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold hover:border-accent hover:text-accent">Compare</button>
      </div>
    </article>
  );
}

export default ProductCard;
