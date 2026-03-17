const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const buildUrl = (path, params) => {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const requestJson = async (path, { method = 'GET', params, body, headers } = {}) => {
  const response = await fetch(buildUrl(path, params), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed');
  }
  return response.json();
};

const getJson = (path, params) => requestJson(path, { params });
const postJson = (path, body) => requestJson(path, { method: 'POST', body });

export const getProducts = (params) => getJson('/api/products', params);
export const getProductById = (id) => getJson(`/api/products/${id}`);
export const getProductBySlug = (slug) => getJson(`/api/products/slug/${encodeURIComponent(slug)}`);
export const getCategories = () => getJson('/api/categories');
export const getSupportCategories = () => getJson('/api/support/categories');
export const getProductsGroupedByCategory = (params) => getJson('/api/products/grouped-by-category', params);
export const submitSupportTicket = (payload) => postJson('/api/support/tickets', payload);
export const submitQuoteRequest = (payload) => postJson('/api/quotes', payload);
export const submitWarrantyRegistration = (payload) => postJson('/api/warranty/register', payload);

