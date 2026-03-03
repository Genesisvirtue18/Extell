import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import SolutionsPage from './pages/SolutionsPage';
import IndustrySolutionsPage from './pages/IndustrySolutionsPage';
import SupportPage from './pages/SupportPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import CertificationsPage from './pages/CertificationsPage';
import DownloadsPage from './pages/DownloadsPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import PartnerPage from './pages/PartnerPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/industry-solutions" element={<IndustrySolutionsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
