import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function CategoryCard({ category, index = 0 }) {
  const count = Number(category.count || 0);
  const badge = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="card-lift rounded-xl border border-white/15 bg-[#0e1a45]/90 p-6 text-white shadow-[0_14px_34px_rgba(3,10,30,0.38)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex rounded-md border border-white/20 bg-white/5 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-slate-300">
          {badge}
        </p>
        <p className="text-xs font-semibold text-[#ff5a73]">{count} products</p>
      </div>
      <h3 className="mt-3 text-2xl font-extrabold leading-tight text-white">{category.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        Browse live catalog items for this category with backend-powered filters and availability.
      </p>
      <Link
        to={`/products?category=${category.slug}`}
        className="mt-5 inline-flex items-center rounded-md border border-[#ff5a73] bg-[#ed2125] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d91f23]"
      >
        View category
      </Link>
    </motion.article>
  );
}

export default CategoryCard;
