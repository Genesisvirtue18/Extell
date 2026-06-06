'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCTA from '@/components/layout/FloatingCTA';
import AppLoader from '@/components/ui/AppLoader';
import CursorGlow from '@/components/ui/CursorGlow';

export default function SiteLayoutWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
    else {
      window.localStorage.setItem('theme', 'light');
    }
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
          {children}
        </main>
        <Footer theme={theme} />
        <FloatingCTA />
      </div>
    </div>
  );
}
