'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Home from '../upsCalc/Pages/Home';
import ResultPage from '../upsCalc/Pages/ResulltPage';
import UPSSelector from '../upsCalc/Pages/UPSSelector';
import '../upsCalc/index.css';

const UpsCalculatorPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname?.replace(/^\/ups-calculator\/?/, '') || '';

  useEffect(() => {
    const allowedPaths = ['', 'result', 'selector'];
    if (pathname && !allowedPaths.includes(currentPath)) {
      router.replace('/ups-calculator');
    }
  }, [pathname, currentPath, router]);

  if (currentPath === '' || currentPath === '/') return <Home />;
  if (currentPath === 'result') return <ResultPage />;
  if (currentPath === 'selector') return <UPSSelector />;

  return null;
};

export default UpsCalculatorPage;
