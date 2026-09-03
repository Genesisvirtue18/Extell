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
  const raw =
    product?.SKU || product?.sku || product?.id || product?.ID || product?._id || '';
  return String(raw).toLowerCase().trim().replace(/\s+/g, '-');
};

// Public product URLs use the product code instead of the display name.
export const getProductSlug = (product) => getProductId(product);

// Returns the URL path parameter. We keep product URLs ID-based on purpose.
export const getProductUrlParam = (product) => {
  const productSlug = getProductSlug(product);
  if (productSlug) return productSlug;

  return slugifyProductName(getProductName(product));
};

export const getProductPath = (product) => {
  const param = getProductUrlParam(product);
  if (!param) return '/products';
  return `/product/${encodeURIComponent(param)}`;
};

export const findProductById = (items, param) =>
  (items || []).find((p) => {
    const pid = getProductId(p);
    return pid === String(param || '').toLowerCase().trim();
  });

export const findProductBySlug = (items, slug) =>
  (items || []).find((item) => {
    const normalizedSlug = String(slug || '').toLowerCase().trim();
    return [
      item?.SKU,
      item?.sku,
      item?.id,
      item?.ID,
      item?._id,
      item?.slug,
      getProductSlug(item),
      slugifyProductName(getProductName(item)),
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase().trim())
      .includes(normalizedSlug);
  });
