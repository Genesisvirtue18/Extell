'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import CategoryCard from '../ui/CategoryCard';
import { getCategories } from '../../lib/api';
import { categories as defaultCategories } from '../../data/siteData';

const staticCategories = [
  {
    slug: 'battery',
    name: 'Battery Systems',
    href: '/products?page=1&category=battery',
  },
  {
    slug: 'ups-accessories',
    name: 'UPS Accessories',
    href: '/products?page=1&category=ups-accessories',
  },
  {
    slug: 'passive-network-solutions',
    name: 'Passive Network Solutions',
    href: '/products?page=1&category=passive-network-solutions',
  },
  {
    slug: 'fiber-accessories',
    name: 'Fiber Accessories',
    href: '/products?page=1&category=fiber-accessories',
  },
];

function CategoryGridSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        setLoading(true);

        const response = await getCategories();
        if (!mounted) return;

        let items = (response.items || []).map((item) => ({
          ...item,
        }));

        /**
         * Merge static categories (always included)
         */
        const mergedItems = [
          ...staticCategories.map((s) => {
            const match = items.find((i) => i.slug === s.slug);
            return match
              ? { ...match, href: s.href || match.href }
              : s;
          }),
          ...items.filter(
            (i) => !staticCategories.some((s) => s.slug === i.slug)
          ),
        ];

        const activeItems = mergedItems.filter(
          (item) => item?.slug && item?.name
        );

        const nextItems = mergedItems.filter(
          (item) =>
            item?.slug &&
            item?.name &&
            !activeItems.find((a) => a.slug === item.slug)
        );

        const combined = [...activeItems];

        if (combined.length < 4) {
          combined.push(...nextItems.slice(0, 4 - combined.length));
        }

        if (combined.length < 4) {
          const existingSlugs = new Set(combined.map((i) => i.slug));

          combined.push(
            ...defaultCategories
              .filter(
                (item) =>
                  item?.slug &&
                  item?.name &&
                  !existingSlugs.has(item.slug)
              )
              .slice(0, 4 - combined.length)
          );
        }

        setCategories(combined.slice(0, 4));
      } catch (error) {
        if (!mounted) return;
        setCategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeader
        eyebrow="Catalog"
        title="Product Categories"
        subtitle="Built for telecom infrastructure, critical power, and digital core facilities."
      />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <div
              key={`cat-skeleton-${idx}`}
              className="ui-surface-1 h-[190px] animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, idx) => (
            <CategoryCard
              key={category.slug}
              category={category}
              index={idx}
            />
          ))}

          {!categories.length && (
            <div className="ui-surface-1 rounded-xl p-6 text-sm ui-text-muted">
              No categories available right now.
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default CategoryGridSection;
