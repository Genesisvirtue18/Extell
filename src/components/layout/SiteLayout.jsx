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
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timeout);
  }, []);

  // Force light theme on first paint; users can still toggle to dark afterward.
  useEffect(() => {
    setTheme('light');
    window.localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="relative min-h-screen ui-page" data-theme={theme}>
      <CursorGlow />
      {isLoading ? <AppLoader /> : null}
      <div className="relative z-10">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="pt-20">
          <Outlet context={{ theme }} />
        </main>
        <Footer theme={theme} />
        <FloatingCTA />
      </div>
    </div>
  );
}

export default SiteLayout;
