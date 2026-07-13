const DEFAULT_SITE_NAME = 'ExTell Systems';
const DEFAULT_CATEGORY = 'Products';

const firstNonEmpty = (...values) => {
  for (const value of values) {
    const text = String(value ?? '').trim();
    if (text) return text;
  }
  return '';
};

const truncate = (value, maxLength) => {
  const text = String(value ?? '').trim();
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
};

export const splitSeoKeywords = (value) =>
  Array.isArray(value)
    ? value.flatMap((entry) => splitSeoKeywords(entry))
    : String(value ?? '')
        .split(/[,;\n]/)
        .map((entry) => entry.trim())
        .filter(Boolean);

export const joinSeoKeywords = (value) => splitSeoKeywords(value).join(', ');

const splitImageValues = (value) => {
  if (Array.isArray(value)) return value.flatMap((entry) => splitImageValues(entry));
  return String(value ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

export const getProductImageList = (product) =>
  [
    ...(Array.isArray(product?.imageList) ? product.imageList : splitImageValues(product?.imageList)),
    ...(Array.isArray(product?.Images) ? product.Images : splitImageValues(product?.Images)),
    ...(Array.isArray(product?.images) ? product.images : splitImageValues(product?.images)),
    ...(Array.isArray(product?.gallery) ? product.gallery : splitImageValues(product?.gallery)),
  ].filter(Boolean);

export const pickBestProductImage = (product, fallback = '') => {
  const candidates = [
    product?.heroImage,
    product?.image,
    ...getProductImageList(product),
    fallback,
  ].filter(Boolean);

  if (!candidates.length) return fallback;

  const scoreImage = (entry) => {
    const value = String(entry || '').toLowerCase();
    let score = 0;

    if (value.includes('/elementor/thumbs/')) score -= 40;
    if (value.includes('placeholder')) score -= 30;
    if (value.includes('front-hero') || value.includes('hero')) score -= 20;
    if (value.includes('iso')) score += 18;
    if (value.includes('side') || value.includes('rear') || value.includes('front')) score += 8;

    return score;
  };

  return [...candidates].sort((a, b) => scoreImage(b) - scoreImage(a))[0] || fallback;
};

const getProductName = (product) => firstNonEmpty(product?.Name, product?.name, 'Product');

const getProductSku = (product) =>
  firstNonEmpty(product?.SKU, product?.sku, product?.id, product?._id).toUpperCase();

const getProductCategory = (product) =>
  firstNonEmpty(
    product?.topCategory,
    product?.Categories,
    product?.category,
    DEFAULT_CATEGORY
  )
    .split('>')
    .map((part) => part.split(',')[0].trim())
    .filter(Boolean)[0] || DEFAULT_CATEGORY;

const getProductImage = (product) =>
  firstNonEmpty(
    product?.heroImage,
    getProductImageList(product)[0]
  );

export const buildProductSeoDraft = (product = {}) => {
  const name = getProductName(product);
  const sku = getProductSku(product);
  const category = getProductCategory(product);
  const descriptionSource = firstNonEmpty(
    product?.descriptionText,
    product?.description,
    product?.shortDescription,
    product?.short
  );
  const imageLabel = sku ? `${name} ${sku}` : name;
  const imageAlt = truncate(`${imageLabel} product image`, 125);
  const imageTitle = truncate(imageLabel, 90);

  const fallbackDescription = `Premium ${category} from ${DEFAULT_SITE_NAME}.`;
  const metaDescription = truncate(
    firstNonEmpty(
      product?.metaDescription,
      product?.seoDescription,
      descriptionSource,
      fallbackDescription
    ),
    160
  );

  const metaTitle = truncate(
    firstNonEmpty(
      product?.metaTitle,
      product?.seoTitle,
      `${imageLabel} | ${DEFAULT_SITE_NAME}`
    ),
    70
  );

  const keywords = Array.from(
    new Set(
      [
        ...splitSeoKeywords(product?.metaKeywords),
        ...splitSeoKeywords(product?.seoKeywords),
        name,
        sku,
        category,
        'UPS',
        'power solutions',
        'ICT infrastructure',
        DEFAULT_SITE_NAME,
      ].filter(Boolean)
    )
  );

  return {
    metaTitle,
    metaDescription,
    metaKeywords: joinSeoKeywords(keywords),
    imageAlt,
    imageTitle,
    imageUrl: getProductImage(product),
    keywords,
  };
};

export const resolveProductSeo = (product = {}) => {
  const draft = buildProductSeoDraft(product);
  const explicitKeywords = splitSeoKeywords(product?.metaKeywords || product?.seoKeywords);

  return {
    metaTitle: firstNonEmpty(product?.metaTitle, product?.seoTitle, draft.metaTitle),
    metaDescription: firstNonEmpty(
      product?.metaDescription,
      product?.seoDescription,
      draft.metaDescription
    ),
    metaKeywords: explicitKeywords.length ? joinSeoKeywords(explicitKeywords) : draft.metaKeywords,
    keywords: explicitKeywords.length ? explicitKeywords : draft.keywords,
    imageAlt: firstNonEmpty(product?.imageAlt, product?.metaImageAlt, draft.imageAlt),
    imageTitle: firstNonEmpty(product?.imageTitle, product?.metaImageTitle, draft.imageTitle),
    imageUrl: draft.imageUrl,
  };
};
