#!/bin/bash

# Create directory structure and page files
create_page() {
  local route=$1
  local component=$2
  local dir="src/app/$route"
  
  mkdir -p "$dir"
  
  cat > "$dir/page.tsx" << EOF
import SiteLayoutWrapper from '@/app/layout-wrapper';
import $component from '@/pages/$component';

export default function Page() {
  return (
    <SiteLayoutWrapper>
      <$component />
    </SiteLayoutWrapper>
  );
}
EOF
  echo "Created page: $route"
}

# Create all public pages
create_page "products" "ProductsPage"
create_page "solutions" "SolutionsPage"
create_page "industry-solutions" "IndustrySolutionsPage"
create_page "support" "SupportPage"
create_page "case-studies" "CaseStudiesPage"
create_page "certifications" "CertificationsPage"
create_page "downloads" "DownloadsPage"
create_page "about" "AboutPage"
create_page "careers" "CareersPage"
create_page "partner" "PartnerPage"
create_page "contact" "ContactPage"
create_page "warranty" "WarrantyPage"
create_page "ups-calculator" "UpsCalculatorPage"

# Create dynamic routes
mkdir -p "src/app/product"
cat > "src/app/product/\[slug\]/page.tsx" << 'EOF'
import SiteLayoutWrapper from '@/app/layout-wrapper';
import ProductDetailPage from '@/pages/ProductDetailPage';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <SiteLayoutWrapper>
      <ProductDetailPage />
    </SiteLayoutWrapper>
  );
}
EOF
echo "Created page: product/[slug]"

mkdir -p "src/app/category"
cat > "src/app/category/\[slug\]/page.tsx" << 'EOF'
import SiteLayoutWrapper from '@/app/layout-wrapper';
import CategoryPage from '@/pages/CategoryPage';

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <SiteLayoutWrapper>
      <CategoryPage />
    </SiteLayoutWrapper>
  );
}
EOF
echo "Created page: category/[slug]"

echo "All pages created!"
