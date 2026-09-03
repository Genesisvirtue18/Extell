import { getPartners, getProducts } from '@/lib/api';
import { products as fallbackProducts } from '@/data/siteData';

export const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const toArray = (response) => {
  const candidates = [
    response,
    response?.items,
    response?.partners,
    response?.products,
    response?.results,
    response?.data,
    response?.data?.items,
    response?.data?.partners,
    response?.data?.products,
    response?.data?.results
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

export const getPagination = (response, fallbackPage = 1, fallbackLimit = 10) => {
  const pagination =
    response?.pagination ||
    response?.meta?.pagination ||
    response?.data?.pagination ||
    response?.meta ||
    response ||
    {};
  const page = Number(pagination.page ?? pagination.currentPage ?? fallbackPage) || fallbackPage;
  const limit = Number(pagination.limit ?? pagination.perPage ?? pagination.pageSize ?? fallbackLimit) || fallbackLimit;
  const total = Number(pagination.total ?? pagination.totalItems ?? pagination.count);
  const totalPages = Number(pagination.totalPages ?? pagination.pages);

  return {
    page,
    limit,
    total: Number.isFinite(total) ? total : null,
    totalPages: Number.isFinite(totalPages) ? totalPages : null
  };
};

export const normalizeProduct = (item) => ({
  id: item?._id || item?.id || item?.sku || item?.SKU || item?.slug || item?.name,
  name: item?.Name || item?.name || item?.title || 'Product',
  sku: item?.SKU || item?.sku || item?.id || '',
  short: item?.short || item?.description || '',
  price: Number(item?.salePrice ?? item?.price ?? item?.basePrice ?? item?.mrp ?? 0) || 0
});

const toPositiveInteger = (value, fallback = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.max(1, Math.floor(parsed));
};

const extractPartnerProductIds = (partner) => {
  const rawSources = [
    partner?.productIds,
    partner?.assignedProductIds,
    partner?.products,
    partner?.productList,
    partner?.catalog,
    partner?.assignedProducts
  ];

  return rawSources.flatMap((source) => {
    if (!Array.isArray(source)) return [];

    return source
      .map((entry) => {
        if (entry == null) return '';
        if (typeof entry === 'string' || typeof entry === 'number') return entry;
        return (
          entry._id ||
          entry.id ||
          entry.productId ||
          entry.product?._id ||
          entry.product?.id ||
          entry.sku ||
          entry.SKU ||
          ''
        );
      })
      .filter(Boolean);
  });
};

const extractPartnerProductQuantities = (partner) => {
  const quantityMap = {};
  const assignQuantity = (productId, quantity) => {
    const normalizedId = String(productId || '').trim();
    if (!normalizedId) return;
    quantityMap[normalizedId] = toPositiveInteger(quantity, 1);
  };

  const objectSources = [partner?.productQuantities, partner?.assignedProductQuantities, partner?.quantities];
  objectSources.forEach((source) => {
    if (!source || Array.isArray(source)) return;
    Object.entries(source).forEach(([productId, quantity]) => assignQuantity(productId, quantity));
  });

  const arraySources = [partner?.productDetails, partner?.assignedProducts, partner?.products];
  arraySources.forEach((source) => {
    if (!Array.isArray(source)) return;
    source.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return;
      const productId =
        entry.productId ||
        entry._id ||
        entry.id ||
        entry.product?._id ||
        entry.product?.id ||
        entry.sku ||
        entry.SKU;
      assignQuantity(productId, entry.quantity || entry.qty || entry.count || 1);
    });
  });

  return quantityMap;
};

export const normalizePartner = (item, index = 0) => {
  const name = item?.name || item?.partnerName || `Partner ${index + 1}`;
  const slug = item?.slug || slugify(name) || `partner-${index + 1}`;
  const city = item?.city || item?.place || '';
  const country = item?.country || '';
  const address = item?.address || item?.location || '';
  const location = [city, country].filter(Boolean).join(', ') || address || 'Location on request';
  const productIds = Array.from(new Set(extractPartnerProductIds(item).map((value) => String(value))));
  const productQuantities = extractPartnerProductQuantities(item);

  return {
    id: item?._id || item?.id || slug,
    slug,
    name,
    createdAt: item?.createdAt || null,
    updatedAt: item?.updatedAt || null,
    contactName: item?.contactName || item?.contact || '',
    email: item?.email || '',
    phone: item?.phone || '',
    website: item?.website || '',
    address,
    city,
    country,
    location,
    status: item?.status || 'active',
    partnerMarkupPercent: Number(item?.partnerMarkupPercent ?? 15) || 15,
    loginEmail: item?.loginEmail || item?.email || '',
    portalNote: item?.portalNote || '',
    productIds,
    productQuantities,
    raw: item
  };
};

export const resolvePartnerProducts = (partner, products = []) => {
  const productMap = new Map(products.map((product) => [String(product.id), product]));
  return (partner?.productIds || [])
    .map((productId) => {
      const resolved = productMap.get(String(productId));
      if (resolved) {
        return {
          ...resolved,
          quantity: partner?.productQuantities?.[String(productId)] || 1
        };
      }

      return {
        id: String(productId),
        name: String(productId),
        sku: '',
        short: 'Assigned product',
        price: 0,
        quantity: partner?.productQuantities?.[String(productId)] || 1
      };
    })
    .filter(Boolean);
};

export const getFallbackPartners = () =>
  [
    {
      id: 'nexgrid',
      name: 'NexGrid Systems',
      contactName: 'Asha Menon',
      email: 'sales@nexgridsystems.com',
      phone: '+91 98765 43210',
      website: 'nexgridsystems.com',
      address: 'Kochi, Kerala, India',
      city: 'Kochi',
      country: 'India',
      slug: 'nexgrid',
      status: 'active',
      partnerMarkupPercent: 12,
      productIds: ['ups-010', 'fc-001']
    },
    {
      id: 'voltaxis',
      name: 'VoltAxis Channel',
      contactName: 'Rahul Prakash',
      email: 'hello@voltaxis.extellsystems.com',
      phone: '+91 98470 11223',
      website: '',
      address: 'Bengaluru, Karnataka, India',
      city: 'Bengaluru',
      country: 'India',
      slug: 'voltaxis',
      status: 'active',
      partnerMarkupPercent: 15,
      productIds: ['dc-021', 'net-014']
    },
    {
      id: 'infrapulse',
      name: 'InfraPulse Partners',
      contactName: 'Meera Joseph',
      email: 'partners@infrapulse.com',
      phone: '+91 99950 22441',
      website: 'infrapulse.com',
      address: 'Hyderabad, Telangana, India',
      city: 'Hyderabad',
      country: 'India',
      slug: 'infrapulse',
      status: 'active',
      partnerMarkupPercent: 10,
      productIds: ['e001gir31', 'ups-010']
    }
  ].map((partner, index) => normalizePartner(partner, index));

export const loadPartnerDirectory = async ({
  partnersLoader = getPartners,
  productsLoader = getProducts,
  page = 1,
  limit = 500
} = {}) => {
  const [partnersResponse, productsResponse] = await Promise.allSettled([
    partnersLoader({ page, limit }),
    productsLoader({ limit: 500 })
  ]);

  if (partnersResponse.status === 'rejected') {
    throw partnersResponse.reason || new Error('Unable to load partners.');
  }

  const partners = toArray(partnersResponse.value);
  const products = productsResponse.status === 'fulfilled' ? toArray(productsResponse.value) : [];

  const normalizedPartners = partners.map((partner, index) => normalizePartner(partner, index));

  const normalizedProducts = (products.length ? products : fallbackProducts).map(normalizeProduct);

  return {
    partners: normalizedPartners,
    products: normalizedProducts,
    pagination: {
      ...getPagination(partnersResponse.value, page, limit),
      total: getPagination(partnersResponse.value, page, limit).total ?? normalizedPartners.length,
      totalPages:
        getPagination(partnersResponse.value, page, limit).totalPages ??
        Math.max(1, Math.ceil(normalizedPartners.length / limit))
    }
  };
};
