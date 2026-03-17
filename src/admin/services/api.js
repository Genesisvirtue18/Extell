import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminLogin = async (payload) => {
  const { data } = await api.post('/api/admin/login', payload);
  return data;
};

export const fetchAdminMe = async () => {
  const { data } = await api.get('/api/admin/me');
  return data;
};

export const fetchDashboard = async () => {
  const { data } = await api.get('/api/admin/dashboard');
  return data;
};

export const fetchHomePage = async () => {
  const { data } = await api.get('/api/admin/homepage');
  return data;
};

export const updateHomePage = async (payload) => {
  const { data } = await api.put('/api/admin/homepage', payload);
  return data;
};

export const fetchAdminProducts = async (params = {}) => {
  const { data } = await api.get('/api/admin/products', { params });
  return data;
};

export const createAdminProduct = async (payload) => {
  const { data } = await api.post('/api/admin/products', payload);
  return data;
};

export const updateAdminProduct = async (id, payload) => {
  const { data } = await api.put(`/api/admin/products/${id}`, payload);
  return data;
};

export const deleteAdminProduct = async (id) => {
  const { data } = await api.delete(`/api/admin/products/${id}`);
  return data;
};

export const fetchAdminCategories = async () => {
  const { data } = await api.get('/api/admin/categories');
  return data;
};

export const fetchSolutions = async () => {
  const { data } = await api.get('/api/admin/solutions');
  return data;
};

export const createSolution = async (payload) => {
  const { data } = await api.post('/api/admin/solutions', payload);
  return data;
};

export const updateSolution = async (id, payload) => {
  const { data } = await api.put(`/api/admin/solutions/${id}`, payload);
  return data;
};

export const deleteSolution = async (id) => {
  const { data } = await api.delete(`/api/admin/solutions/${id}`);
  return data;
};

export const fetchProjects = async () => {
  const { data } = await api.get('/api/admin/projects');
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post('/api/admin/projects', payload);
  return data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/api/admin/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/api/admin/projects/${id}`);
  return data;
};

export const fetchResources = async () => {
  const { data } = await api.get('/api/admin/resources');
  return data;
};

export const createResource = async (payload) => {
  const { data } = await api.post('/api/admin/resources', payload);
  return data;
};

export const deleteResource = async (id) => {
  const { data } = await api.delete(`/api/admin/resources/${id}`);
  return data;
};

export const fetchTickets = async (params = {}) => {
  const { data } = await api.get('/api/admin/tickets', { params });
  return data;
};

export const updateTicketStatus = async (id, status) => {
  const { data } = await api.put(`/api/admin/tickets/${id}/status`, { status });
  return data;
};

export const fetchWarrantyRegistrations = async (params = {}) => {
  const { data } = await api.get('/api/admin/warranties', { params });
  return data;
};

export const updateWarrantyStatus = async (id, status) => {
  const { data } = await api.put(`/api/admin/warranties/${id}/status`, { status });
  return data;
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get('/api/admin/users');
  return data;
};

export const createAdminUser = async (payload) => {
  const { data } = await api.post('/api/admin/users', payload);
  return data;
};

export const fetchQuoteRequests = async (params = {}) => {
  const { data } = await api.get('/api/admin/quotes', { params });
  return data;
};

export const updateQuoteStatus = async (id, status) => {
  const { data } = await api.put(`/api/admin/quotes/${id}/status`, { status });
  return data;
};

export default api;


