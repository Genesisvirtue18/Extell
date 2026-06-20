'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function CategoryCard({ category, index = 0 }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="ui-surface-1 group flex flex-col rounded-xl p-5 transition hover:border-[#ed2125]/30"
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-[#ed2125]">{num}</span>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug ui-text">{category.name}</h3>

      <p className="mt-1.5 flex-1 text-xs leading-relaxed ui-text-muted">
        Browse live catalog with filters and availability.
      </p>

      <Link
        href={`/products?category=${category.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#ed2125] transition group-hover:gap-2.5"
      >
        View Category
        <ArrowRight size={13} />
      </Link>
    </motion.article>
  );
}

export default CategoryCard;
