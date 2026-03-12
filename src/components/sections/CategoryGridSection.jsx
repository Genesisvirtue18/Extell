import { useEffect, useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import CategoryCard from '../ui/CategoryCard';
import { getCategories } from '../../lib/api';

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
        setCategories((response.items || []).filter((item) => item?.slug && item?.name));
      } catch {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <div key={`cat-skeleton-${idx}`} className="ui-surface-1 h-[190px] animate-pulse rounded-xl" />
          ))}
        </div>
      ) : null}
      {!loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category, idx) => (
            <CategoryCard key={category.slug} category={category} index={idx} />
          ))}
          {!categories.length ? (
            <div className="ui-surface-1 rounded-xl p-6 text-sm ui-text-muted">
              No categories available right now.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default CategoryGridSection;

