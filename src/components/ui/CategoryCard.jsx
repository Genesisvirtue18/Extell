'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categoryIcons = {
  battery: '⚡',
  ups: '🔋',
  fiber: '🔌',
  cabling: '📡',
  networking: '🌐',
  power: '⚡',
  default: '◈',
};

function getCategoryIcon(slug = '') {
  const s = slug.toLowerCase();
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (s.includes(key)) return icon;
  }
  return categoryIcons.default;
}

function CategoryCard({ category, index = 0 }) {
  const num = String(index + 1).padStart(2, '0');
  const icon = getCategoryIcon(category.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group tech-panel red-wash relative flex flex-col overflow-hidden rounded-2xl p-6 shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition-[border-color,box-shadow] hover:border-[#ed2125]/30 hover:shadow-[0_0_0_1px_rgba(237,33,37,0.2),0_24px_48px_rgba(4,17,40,0.45)]"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ed2125]/20 bg-[#ed2125]/10 text-xl">
          {icon}
        </span>
        <span className="text-[0.65rem] font-bold tracking-[0.14em] text-white/20">{num}</span>
      </div>

      {/* Name */}
      <h3 className="mt-4 text-lg font-extrabold leading-tight tracking-tight text-white">
        {category.name}
      </h3>

      {/* Description */}
      <p className="mt-2 flex-1 text-xs leading-relaxed text-white/40">
        Enterprise-grade products with live catalog and availability filters.
      </p>

      {/* CTA */}
      <Link
        href={`/products?category=${category.slug}`}
        className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg border border-[#ed2125]/40 bg-[#ed2125]/10 px-4 py-2 text-xs font-bold tracking-wide text-[#ed2125] transition hover:bg-[#ed2125] hover:text-white"
      >
        View Category
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.article>
  );
}

export default CategoryCard;
