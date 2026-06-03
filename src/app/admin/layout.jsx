'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/admin/hooks/useAdminAuth';
import AdminLayout from '@/admin/layout/AdminLayout';

export default function AdminLayoutWrapper({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  // For other admin pages, use AdminLayout
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
