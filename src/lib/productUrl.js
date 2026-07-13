const getProductName = (product) => product?.Name || product?.name || '';

export const slugifyProductName = (name) =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Returns the canonical SKU/ID used for public product URLs and metadata.
export const getProductId = (product) => {
  const raw = product?.SKU || product?.sku || product?.id || product?._id || '';
  return String(raw).toLowerCase().trim().replace(/\s+/g, '-');
};

// Returns the URL path parameter. We keep product URLs ID-based on purpose.
export const getProductUrlParam = (product) => {
  const productId = getProductId(product);
  if (productId) return productId;

  return slugifyProductName(getProductName(product));
};

export const getProductPath = (product) => {
  const param = getProductUrlParam(product);
  if (!param) return '/products';
  return `/product/${encodeURIComponent(param)}`;
};

// For legacy backward-compatibility only.
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
