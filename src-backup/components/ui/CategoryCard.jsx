import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function CategoryCard({ category, index = 0 }) {
  const count = Number(category.count || 0);
  const badge = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="card-lift ui-surface-1 rounded-xl p-6 ui-text shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="ui-border ui-bg-soft inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold tracking-[0.14em] ui-text-muted">
          {badge}
        </p>
        <p className="text-xs font-semibold text-[#ff5a73]">{count} products</p>
      </div>
      <h3 className="mt-3 text-2xl font-extrabold leading-tight ui-text">{category.name}</h3>
      <p className="mt-2 text-sm leading-relaxed ui-text-muted">
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

