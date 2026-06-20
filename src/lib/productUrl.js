const getProductName = (product) => product?.Name || product?.name || '';

// Returns the canonical ID used in URLs — prefers SKU, then id field
export const getProductId = (product) => {
  const raw =
    product?.SKU ||
    product?.sku ||
    product?.id ||
    product?._id ||
    '';
  return String(raw).toLowerCase().trim().replace(/\s+/g, '-');
};

// Still exported so the sitemap fallback can derive IDs from static data
export const slugifyProductName = (name) =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Kept for backward-compatibility (used only by legacy static-data lookups)
export const getProductSlug = (product) => slugifyProductName(getProductName(product));

export const getProductPath = (product) => {
  const id = getProductId(product);
  if (!id) return '/products';
  return `/product/${encodeURIComponent(id)}`;
};

// Find a product in a static list by its ID/SKU (case-insensitive)
export const findProductById = (items, param) =>
  (items || []).find((p) => {
    const pid = getProductId(p);
    return pid === String(param || '').toLowerCase().trim();
  });

// Legacy name-slug lookup (kept for fallback)
export const findProductBySlug = (items, slug) =>
  (items || []).find((item) => slugifyProductName(getProductName(item)) === slug);
