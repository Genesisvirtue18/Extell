'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth, AdminAuthProvider } from '@/admin/hooks/useAdminAuth';
import AdminLayout from '@/admin/layout/AdminLayout';

function AdminLayoutContent({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Allow access to login page without authentication
    if (pathname === '/admin/login') {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // For login page, don't use AdminLayout wrapper
  if (pathname === '/admin/login') {
    return children;
  }

  // Show loading only after hydration to prevent mismatch
  if (!mounted || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminLayoutWrapper({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
