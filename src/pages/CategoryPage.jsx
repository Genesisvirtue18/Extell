import { useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import ProductCard from '../components/ui/ProductCard';
import { categories, products } from '../data/siteData';

function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const listing = products.filter((item) => item.category === slug);

  return (
    <>
      <PageHero
        title={category ? category.name : 'Category'}
        description="Structured product lines with enterprise-grade documentation and deployment readiness."
      />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          {listing.length ? listing.map((product) => <ProductCard key={product.id} product={product} onCompare={() => {}} />) : <p>No products in this category yet.</p>}
        </div>
      </section>
    </>
  );
}

export default CategoryPage;