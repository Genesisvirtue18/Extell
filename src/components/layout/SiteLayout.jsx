import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';
import AppLoader from '../ui/AppLoader';
import CursorGlow from '../ui/CursorGlow';

function SiteLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-screen bg-deep text-white">
      <CursorGlow />
      {isLoading ? <AppLoader /> : null}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-20">
          <Outlet />
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </div>
  );
}

export default SiteLayout;
