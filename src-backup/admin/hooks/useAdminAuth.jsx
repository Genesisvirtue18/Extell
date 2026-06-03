import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { adminLogin, fetchAdminMe } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const loadMe = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetchAdminMe();
      setAdmin(response.admin || null);
    } catch (error) {
      setAdmin(null);
      localStorage.removeItem('admin_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, [token]);

  const login = async (payload) => {
    const response = await adminLogin(payload);
    localStorage.setItem('admin_token', response.token);
    setToken(response.token);
    setAdmin(response.admin);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ token, admin, loading, login, logout, refresh: loadMe }),
    [token, admin, loading]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
