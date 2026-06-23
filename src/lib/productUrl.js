const getProductName = (product) => product?.Name || product?.name || '';

export const slugifyProductName = (name) =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Returns the canonical SKU/ID — used for schema.org sku, metadata, etc.
export const getProductId = (product) => {
  const raw =
    product?.SKU ||
    product?.sku ||
    product?.id ||
    product?._id ||
    '';
  return String(raw).toLowerCase().trim().replace(/\s+/g, '-');
};

// Returns the URL path parameter — prefers SKU/ID for public product URLs,
// falls back to the API slug for older static-data products.
export const getProductUrlParam = (product) => {
  const productId = getProductId(product);
  if (productId) return productId;

  const apiSlug = product?.slug;
  if (apiSlug) return String(apiSlug).toLowerCase().trim();

  return slugifyProductName(getProductName(product));
};

export const getProductPath = (product) => {
  const param = getProductUrlParam(product);
  if (!param) return '/products';
  return `/product/${encodeURIComponent(param)}`;
};

// For legacy backward-compatibility only — external callers that still import this
export const getProductSlug = (product) => slugifyProductName(getProductName(product));

export const findProductById = (items, param) =>
  (items || []).find((p) => {
    const pid = getProductId(p);
    return pid === String(param || '').toLowerCase().trim();
  });

export const findProductBySlug = (items, slug) =>
  (items || []).find(
    (item) =>
      (item?.slug || '').toLowerCase() === slug ||
      slugifyProductName(getProductName(item)) === slug
  );
