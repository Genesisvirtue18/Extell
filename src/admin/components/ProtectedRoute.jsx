'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../hooks/useAdminAuth';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/admin/login');
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Loading admin...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
