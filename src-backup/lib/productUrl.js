const getProductName = (product) => product?.Name || product?.name || '';

export const slugifyProductName = (name) =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getProductSlug = (product) => slugifyProductName(getProductName(product));

export const getProductPath = (product) => {
  const slug = getProductSlug(product);
  return `/product/${encodeURIComponent(slug)}`;
};

export const findProductBySlug = (items, slug) =>
  (items || []).find((item) => slugifyProductName(getProductName(item)) === slug);
