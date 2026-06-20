/**
 * Central schema.org builder library for AEO and GEO.
 *
 * AEO (Answer Engine Optimization) — targets featured snippets, People Also Ask,
 * voice search, and direct-answer surfaces.
 *
 * GEO (Generative Engine Optimization) — targets AI-powered search surfaces
 * (Google SGE, ChatGPT, Perplexity, Bing Copilot, etc.) by providing rich,
 * machine-readable entity data that AI systems use to understand and cite the site.
 */

import { CANONICAL_SITE_URL, canonicalUrl } from './siteUrl';

// ─── Stable entity IDs — used across the whole site for entity disambiguation ─

export const ORG_ID = `${CANONICAL_SITE_URL}/#organization`;
export const WEBSITE_ID = `${CANONICAL_SITE_URL}/#website`;

// ─── Core reusable entities ───────────────────────────────────────────────────

/**
 * Comprehensive Organization entity.
 * GEO: AI systems pull brand/company facts from this node.
 */
export const organizationSchema = {
  '@type': ['Organization', 'Corporation'],
  '@id': ORG_ID,
  name: 'ExTell Systems',
  legalName: 'ExTell Systems Pvt Ltd',
  alternateName: ['ExTell', 'Extell Systems'],
  url: CANONICAL_SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${CANONICAL_SITE_URL}/#logo`,
    url: canonicalUrl('/assets/logo.png'),
    contentUrl: canonicalUrl('/assets/logo.png'),
    width: 400,
    height: 100,
    caption: 'ExTell Systems',
  },
  image: canonicalUrl('/assets/homebg.jpg'),
  description:
    'ExTell Systems is an international manufacturer and distributor of UPS systems, fiber cables, data center solutions, power distribution units, and ICT infrastructure, serving enterprise customers across 20+ countries.',
  slogan: 'Enterprise Power & ICT Infrastructure',
  foundingDate: '2020',
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
  areaServed: [
    { '@type': 'Country', name: 'India', sameAs: 'https://www.wikidata.org/wiki/Q668' },
    { '@type': 'Country', name: 'United Arab Emirates', sameAs: 'https://www.wikidata.org/wiki/Q878' },
    { '@type': 'Country', name: 'Bahrain', sameAs: 'https://www.wikidata.org/wiki/Q398' },
    { '@type': 'Country', name: 'United States', sameAs: 'https://www.wikidata.org/wiki/Q30' },
  ],
  knowsAbout: [
    'UPS Systems',
    'Uninterruptible Power Supply',
    'Modular UPS',
    'Industrial UPS',
    'Online Double Conversion UPS',
    'Fiber Optic Cables',
    'Structured Cabling Systems',
    'Data Center Power',
    'Power Distribution Units',
    'ICT Infrastructure',
    'Network Equipment',
    'Solar Power Solutions',
    'Power Electronics',
    'Enterprise Networking',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'ExTell Systems Product Catalog',
    url: canonicalUrl('/products'),
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'UPS Systems', url: canonicalUrl('/category/ups-systems') },
      { '@type': 'OfferCatalog', name: 'Fiber Cables', url: canonicalUrl('/category/fiber-cables') },
      { '@type': 'OfferCatalog', name: 'Data Center Solutions', url: canonicalUrl('/category/data-center-solutions') },
      { '@type': 'OfferCatalog', name: 'Networking Products', url: canonicalUrl('/category/networking-products') },
      { '@type': 'OfferCatalog', name: 'Power Electronics', url: canonicalUrl('/category/power-electronics') },
    ],
  },
  sameAs: [
    'https://www.linkedin.com/company/extellsystems/',
    'https://www.justdial.com/jdmart/Ernakulam/ExTell-Systems-HMT-Colony/0484PX484-X484-221214162013-A6L7_BZDET/catalogue',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@extellsystems.com',
      areaServed: 'US',
      availableLanguage: ['English'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+971-6-779-4299',
      email: 'sales.imea@extellsystems.com',
      areaServed: ['AE', 'BH'],
      availableLanguage: ['English', 'Arabic'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@extellsystems.com',
      availableLanguage: ['English'],
    },
  ],
};

/**
 * WebSite entity with SiteLinksSearchBox.
 * GEO: Signals that the site is a structured searchable entity.
 */
export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: CANONICAL_SITE_URL,
  name: 'ExTell Systems',
  description:
    'Enterprise UPS systems, power backup, fiber cables, data center solutions, and ICT infrastructure.',
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${CANONICAL_SITE_URL}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ─── Schema builders ─────────────────────────────────────────────────────────

/**
 * BreadcrumbList
 * AEO: Enables breadcrumb rich result in SERPs.
 */
export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * FAQPage — the single most impactful AEO schema.
 * Triggers People Also Ask panels and voice-search direct answers.
 * GEO: AI surfaces pull Q&A pairs as factual references.
 */
export const buildFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

/**
 * ItemList — for product/service listing pages.
 * AEO: Enables carousel and list-type rich results.
 * GEO: AI systems understand the catalog structure.
 */
export const buildItemListSchema = (name, url, items) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  url,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: item.url,
    ...(item.image ? { image: item.image } : {}),
    ...(item.description ? { description: item.description } : {}),
  })),
});

/**
 * CollectionPage — wraps a product category or listing page.
 * GEO: Marks a URL as an authoritative collection of a product type.
 */
export const buildCollectionPageSchema = ({ name, url, description }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  url,
  description,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  provider: { '@id': ORG_ID },
});

/**
 * Product-specific FAQ — generated from live product data.
 * AEO: Answers the most common buyer questions directly in SERPs.
 * GEO: Provides AI with factual Q&A about the exact product.
 */
export const buildProductFAQSchema = (product, url) => {
  const name = product?.Name || product?.name || 'this product';
  const sku = (product?.SKU || product?.sku || product?.id || '').toUpperCase();
  const category =
    String(product?.topCategory || product?.Categories || product?.category || '')
      .split('>')[0]
      .split(',')[0]
      .trim() || 'enterprise product';
  const inStock = product?.inStock;

  return buildFAQSchema([
    {
      q: `What is the model number of ${name}?`,
      a: sku
        ? `The model number (SKU) of ${name} is ${sku}. Full technical specifications are available at ${url}.`
        : `Visit the ${name} product page for the full model and SKU information.`,
    },
    {
      q: `Is ${name} available for purchase?`,
      a:
        inStock === true
          ? `Yes, ${name} (${sku}) is currently in stock. Contact ExTell Systems at sales@extellsystems.com or use the quote form on the product page to order.`
          : inStock === false
          ? `${name} may be available to order. Contact sales@extellsystems.com with your requirements for availability and lead time.`
          : `Please contact ExTell Systems at sales@extellsystems.com to confirm current availability of ${name}.`,
    },
    {
      q: `How do I get a price quote for ${name}?`,
      a: `Submit the "Get a Quote" form on the ${name} product page at ${url}, or email your requirements to sales@extellsystems.com. ExTell typically responds within 2 business hours.`,
    },
    {
      q: `What is the warranty on ${name}?`,
      a: `ExTell Systems provides standard product warranty on all products including ${name}. Register your product at extellsystems.com/warranty or contact support@extellsystems.com for specific warranty terms.`,
    },
    {
      q: `What is ${name} used for?`,
      a:
        product?.shortDescription ||
        (product?.description ? String(product.description).slice(0, 200) : null) ||
        `${name} is a ${category} product from ExTell Systems, suitable for enterprise power protection and ICT infrastructure deployments.`,
    },
    {
      q: `Where can I buy ${name}?`,
      a: `${name} (${sku}) is available through ExTell Systems directly or through authorized distributors. Visit extellsystems.com/contact or email sales@extellsystems.com.`,
    },
  ]);
};

/**
 * Enhanced Product schema with additionalProperty for specs.
 * GEO: Provides AI with structured, machine-readable product attributes.
 */
export const buildProductSchema = (product, url) => {
  const name = product?.Name || product?.name || 'Product';
  const sku = (product?.SKU || product?.sku || product?.id || '').toUpperCase();
  const productImage =
    product?.images?.[0] ||
    product?.imageList?.[0] ||
    product?.heroImage ||
    canonicalUrl('/assets/placeholder-tech.svg');

  const specRows = Array.isArray(product?.detailRows)
    ? product.detailRows
    : product?.specs && typeof product.specs === 'object'
    ? Object.entries(product.specs).map(([parameter, value]) => ({ parameter, value }))
    : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name,
    ...(sku ? { sku, mpn: sku } : {}),
    image: product.imageList?.length
      ? product.imageList
      : product.images?.length
      ? product.images
      : [productImage],
    description: product.description || product.descriptionText || name,
    brand: {
      '@type': 'Brand',
      name: 'ExTell Systems',
      logo: canonicalUrl('/assets/logo.png'),
    },
    manufacturer: { '@id': ORG_ID },
    seller: { '@id': ORG_ID },
    ...(specRows.length
      ? {
          additionalProperty: specRows.map((row) => ({
            '@type': 'PropertyValue',
            name: row.parameter,
            value: row.value,
          })),
        }
      : {}),
    offers: {
      '@type': 'Offer',
      '@id': `${url}#offer`,
      priceCurrency: 'INR',
      ...(product.price && !Number.isNaN(Number(product.price))
        ? { price: Number(product.price) }
        : {}),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url,
      seller: { '@id': ORG_ID },
    },
  };
};

/**
 * Service schema for solution/industry pages.
 * GEO: Helps AI understand what services the company offers.
 */
export const buildServiceSchema = ({ name, description, url, serviceType }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url,
  serviceType: serviceType || name,
  provider: { '@id': ORG_ID },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United Arab Emirates' },
    { '@type': 'Country', name: 'Bahrain' },
    { '@type': 'Country', name: 'United States' },
  ],
  category: 'Enterprise Infrastructure',
});

/**
 * LocalBusiness entries for each office.
 * AEO: Triggers local pack results and Google Maps associations.
 */
export const localBusinessSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-india`,
    name: 'ExTell Systems — India',
    legalName: 'ExTell Systems Pvt Ltd',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logo.png'),
    image: canonicalUrl('/assets/homebg.jpg'),
    description:
      'Enterprise UPS systems, fiber cables, data center infrastructure, and ICT products. Engineering, sourcing, and execution support hub.',
    telephone: null,
    email: 'sales@extellsystems.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ernakulam',
      addressRegion: 'Kerala',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 9.9816,
      longitude: 76.2999,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    currenciesAccepted: 'INR',
    priceRange: '$$',
    parentOrganization: { '@id': ORG_ID },
  },
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-uae`,
    name: 'ExTell Systems — UAE',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logo.png'),
    description:
      'ExTell Systems UAE — Regional operations and distribution hub for enterprise UPS, fiber cables, and ICT infrastructure in the Middle East.',
    telephone: '+97167794299',
    email: 'sales.imea@extellsystems.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sharjah',
      addressCountry: 'AE',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    currenciesAccepted: 'AED',
    parentOrganization: { '@id': ORG_ID },
  },
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-bahrain`,
    name: 'ExTell Systems — Bahrain',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logo.png'),
    description:
      'ExTell Systems Bahrain — enterprise UPS systems, fiber cables, and ICT infrastructure solutions.',
    telephone: '+97338835435',
    email: 'sales.imea@extellsystems.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BH',
    },
    currenciesAccepted: 'BHD',
    parentOrganization: { '@id': ORG_ID },
  },
];

/**
 * Speakable specification — marks content readable by voice assistants.
 * AEO: Core voice-search optimization signal.
 */
export const buildSpeakableSchema = (url, cssSelectors) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  url,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  },
});

/**
 * HowTo schema for process/calculator pages.
 * AEO: Triggers step-by-step rich results.
 */
export const buildHowToSchema = ({ name, description, url, steps, estimatedCost }) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  url,
  ...(estimatedCost ? { estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '0' } } : {}),
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    ...(step.url ? { url: step.url } : {}),
  })),
});

/**
 * Serialize one or more schema objects to a JSON-LD @graph string.
 */
export const toJsonLd = (...schemas) => {
  if (schemas.length === 1) return JSON.stringify(schemas[0]);
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
};
