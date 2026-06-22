'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

const RED = '#ed2125';

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const t1 = useRef(null);
  const t2 = useRef(null);
  const t3 = useRef(null);

  useEffect(() => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    clearTimeout(t3.current);
    setWidth(0);
    setVisible(true);
    t1.current = setTimeout(() => setWidth(72), 60);
    t2.current = setTimeout(() => setWidth(100), 650);
    t3.current = setTimeout(() => setVisible(false), 1050);
    return () => {
      clearTimeout(t1.current);
      clearTimeout(t2.current);
      clearTimeout(t3.current);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        width: `${width}%`,
        background: `linear-gradient(90deg, ${RED} 0%, #ff5a5e 100%)`,
        zIndex: 99999,
        transition: width === 0 ? 'none' : 'width 0.55s cubic-bezier(0.1, 0.6, 0.1, 1)',
        boxShadow: `0 0 10px ${RED}99`,
        borderRadius: '0 3px 3px 0',
      }}
    />
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
