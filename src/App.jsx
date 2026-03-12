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
import { AdminAuthProvider } from './admin/hooks/useAdminAuth';
import AdminLayout from './admin/layout/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLoginPage from './admin/pages/LoginPage';
import AdminDashboardPage from './admin/pages/DashboardPage';
import AdminProductsPage from './admin/pages/ProductsPage';
import AdminUsersPage from './admin/pages/UsersPage';
import AdminSolutionsPage from './admin/pages/SolutionsPage';
import AdminProjectsPage from './admin/pages/ProjectsPage';
import AdminResourcesPage from './admin/pages/ResourcesPage';
import AdminTicketsPage from './admin/pages/TicketsPage';
import AdminHomepagePage from './admin/pages/HomepagePage';
import AdminSettingsPage from './admin/pages/SettingsPage';

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/solutions" element={<AdminSolutionsPage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
            <Route path="/admin/resources" element={<AdminResourcesPage />} />
            <Route path="/admin/tickets" element={<AdminTicketsPage />} />
            <Route path="/admin/homepage" element={<AdminHomepagePage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>

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
    </AdminAuthProvider>
  );
}

export default App;
