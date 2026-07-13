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
import { resolveProductSeo } from './productSeo';

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
  alternateName: ['ExTell', 'Extell Systems', 'ExTell Systems Pvt Ltd'],
  url: CANONICAL_SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${CANONICAL_SITE_URL}/#logo`,
    url: canonicalUrl('/assets/logowhite.jpg'),
    contentUrl: canonicalUrl('/assets/logowhite.jpg'),
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
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ernakulam',
    addressRegion: 'Kerala',
    addressCountry: 'IN',
  },
  email: 'sales@extellsystems.com',
  areaServed: [
    { '@type': 'Country', name: 'India', sameAs: 'https://www.wikidata.org/wiki/Q668' },
    { '@type': 'Country', name: 'United Arab Emirates', sameAs: 'https://www.wikidata.org/wiki/Q878' },
    { '@type': 'Country', name: 'Bahrain', sameAs: 'https://www.wikidata.org/wiki/Q398' },
    { '@type': 'Country', name: 'United States', sameAs: 'https://www.wikidata.org/wiki/Q30' },
    { '@type': 'Country', name: 'Saudi Arabia', sameAs: 'https://www.wikidata.org/wiki/Q851' },
    { '@type': 'Country', name: 'Kuwait', sameAs: 'https://www.wikidata.org/wiki/Q817' },
    { '@type': 'Country', name: 'Oman', sameAs: 'https://www.wikidata.org/wiki/Q842' },
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
    'DCIM',
    'Battery Backup Systems',
    'Critical Power Infrastructure',
    'Enterprise Data Center Solutions',
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
    'https://www.linkedin.com/company/extellsystems/?viewAsMember=true',
    'https://www.justdial.com/jdmart/Ernakulam/ExTell-Systems-HMT-Colony/0484PX484-X484-221214162013-A6L7_BZDET/catalogue',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'sales@extellsystems.com',
      areaServed: 'US',
      availableLanguage: ['English'],
      contactOption: 'TollFree',
    },
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+971-6-779-4299',
      email: 'sales.imea@extellsystems.com',
      areaServed: ['AE', 'BH', 'SA', 'KW', 'OM'],
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
  const seo = resolveProductSeo(product);

  const backendFaqs = Array.isArray(product?.faqs)
    ? product.faqs
        .map((entry) => {
          if (typeof entry === 'object' && entry !== null) {
            const question = String(entry.question || entry.q || entry.title || entry.heading || '').trim();
            const answer = String(entry.answer || entry.a || entry.detail || entry.text || entry.content || '').trim();
            return question || answer ? { q: question, a: answer } : null;
          }

          if (typeof entry === 'string' && entry.trim()) {
            return { q: entry.trim(), a: '' };
          }

          return null;
        })
        .filter(Boolean)
    : [];

  if (backendFaqs.length) {
    return buildFAQSchema(backendFaqs);
  }

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
        seo.metaDescription ||
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
  const seo = resolveProductSeo(product);
  const name = product?.Name || product?.name || 'Product';
  const sku = (product?.SKU || product?.sku || product?.id || '').toUpperCase();
  const category = String(
    product?.topCategory || product?.Categories || product?.category || ''
  ).split('>')[0].split(',')[0].trim() || 'Enterprise Products';

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

  // availability: default InStock for B2B catalog; only OutOfStock when explicitly false
  const availability =
    product.inStock === false
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock';

  // priceValidUntil: 1 year from now (required by Google Merchant for rich results)
  const priceValidUntil = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name,
    ...(sku ? { sku, mpn: sku } : {}),
    category,
    image: product.imageList?.length
      ? product.imageList
      : product.images?.length
      ? product.images
      : [productImage],
    description:
      seo.metaDescription ||
      product.description ||
      product.descriptionText ||
      product.short ||
      name,
    brand: {
      '@type': 'Brand',
      name: 'ExTell Systems',
      logo: canonicalUrl('/assets/logowhite.jpg'),
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
      url,
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
      // Only emit price + priceCurrency together — never one without the other.
      // priceCurrency alone (without price) causes "Invalid price format" in GSC.
      // For B2B quote-only products, omit both fields; Google shows "Check price".
      ...(product.price && Number(product.price) > 0 && !Number.isNaN(Number(product.price))
        ? {
            price: String(Number(product.price).toFixed(2)),
            priceCurrency: 'USD',
            priceValidUntil,
          }
        : {}),
      // shippingRate.value MUST be a valid float — omitting value causes
      // "Invalid floating point number in property 'price'" in Merchant Listings.
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: [
          { '@type': 'DefinedRegion', addressCountry: 'IN' },
          { '@type': 'DefinedRegion', addressCountry: 'AE' },
          { '@type': 'DefinedRegion', addressCountry: 'BH' },
          { '@type': 'DefinedRegion', addressCountry: 'US' },
        ],
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
          cutoffTime: '17:00',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 14, unitCode: 'DAY' },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: ['IN', 'AE', 'BH', 'US'],
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };
};

/**
 * AEO FAQ for the products catalog listing page.
 * Targets "where to buy UPS", "ExTell catalog" type queries.
 */
export const productCatalogFAQSchema = buildFAQSchema([
  {
    q: 'What types of products does ExTell Systems sell?',
    a: 'ExTell Systems offers enterprise UPS systems (modular and static), fiber optic cables, structured cabling solutions, data center PDUs, networking equipment, and ICT infrastructure products for commercial and industrial use.',
  },
  {
    q: 'Can I buy ExTell Systems products online?',
    a: 'ExTell Systems is a B2B supplier. Products are available via quote request. Browse the product catalog at extellsystems.com/products and submit a "Get a Quote" request from any product page, or email sales@extellsystems.com.',
  },
  {
    q: 'Does ExTell Systems ship internationally?',
    a: 'Yes. ExTell Systems ships enterprise products to customers across 20+ countries, including India, UAE, Bahrain, Saudi Arabia, Kuwait, Oman, and the United States. Contact sales@extellsystems.com for shipping terms.',
  },
  {
    q: 'What is the minimum order quantity for ExTell Systems products?',
    a: 'ExTell Systems serves enterprise and commercial customers. Minimum order quantities vary by product line. Contact sales@extellsystems.com or use the quote form to discuss project-specific requirements.',
  },
  {
    q: 'Are ExTell Systems products certified for use in the Middle East?',
    a: 'Yes. ExTell Systems products meet relevant regional standards and certifications for Middle East markets including UAE, Bahrain, and GCC countries. Visit extellsystems.com/certifications for details.',
  },
]);

/**
 * AEO FAQ builder for product category pages.
 * Targets "best UPS for data centers", "[category] products" etc.
 */
export const buildCategoryFAQSchema = (categoryName, categoryUrl) =>
  buildFAQSchema([
    {
      q: `What ${categoryName} products does ExTell Systems offer?`,
      a: `ExTell Systems offers a comprehensive range of ${categoryName} for enterprise, data center, and industrial applications. Browse the full selection at ${categoryUrl}.`,
    },
    {
      q: `How do I get a quote for ${categoryName} from ExTell Systems?`,
      a: `Select your preferred ${categoryName} product from the catalog, then click "Get a Quote" on the product page. You can also email sales@extellsystems.com or call the nearest ExTell office.`,
    },
    {
      q: `Are ExTell Systems ${categoryName} suitable for data centers?`,
      a: `Yes. ExTell Systems ${categoryName} are designed for enterprise and data center environments, including high-availability, N+1 redundancy, and 24/7 operation requirements.`,
    },
    {
      q: `What is the warranty on ExTell Systems ${categoryName}?`,
      a: `Warranty periods vary by product model. Most ExTell Systems products carry a 1–2 year manufacturer warranty. Register your product at extellsystems.com/warranty or contact support@extellsystems.com.`,
    },
  ]);

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
  // ── India HQ ──────────────────────────────────────────────────────────────
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-india`,
    name: 'ExTell Systems',
    legalName: 'ExTell Systems Pvt Ltd',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logowhite.jpg'),
    image: canonicalUrl('/assets/homebg.jpg'),
    description:
      'Enterprise UPS systems, fiber optic cables, data center infrastructure, and ICT products. Global headquarters and engineering hub.',
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
    currenciesAccepted: 'INR, USD',
    priceRange: '$$',
    hasMap: 'https://maps.google.com/?q=Ernakulam,Kerala,India',
    sameAs: [
      'https://www.linkedin.com/company/extellsystems/',
      'https://www.justdial.com/jdmart/Ernakulam/ExTell-Systems-HMT-Colony/0484PX484-X484-221214162013-A6L7_BZDET/catalogue',
    ],
    parentOrganization: { '@id': ORG_ID },
  },
  // ── UAE (Sharjah) ─────────────────────────────────────────────────────────
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-uae`,
    name: 'ExTell Systems — UAE',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logowhite.jpg'),
    image: canonicalUrl('/assets/homebg.jpg'),
    description:
      'ExTell Systems UAE — Regional distribution hub for enterprise UPS, fiber cables, and ICT infrastructure across the Middle East.',
    telephone: '+971-6-779-4299',
    email: 'sales.imea@extellsystems.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sharjah',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.3463,
      longitude: 55.4209,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    currenciesAccepted: 'AED, USD',
    priceRange: '$$',
    hasMap: 'https://maps.google.com/?q=Sharjah,UAE',
    parentOrganization: { '@id': ORG_ID },
  },
  // ── Bahrain (Manama) ──────────────────────────────────────────────────────
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-bahrain`,
    name: 'ExTell Systems — Bahrain',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logowhite.jpg'),
    image: canonicalUrl('/assets/homebg.jpg'),
    description:
      'ExTell Systems Bahrain — enterprise UPS systems, fiber cables, and ICT infrastructure solutions for Bahrain and GCC markets.',
    telephone: '+973-3883-5435',
    email: 'sales.imea@extellsystems.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Manama',
      addressCountry: 'BH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.2285,
      longitude: 50.5860,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    currenciesAccepted: 'BHD, USD',
    priceRange: '$$',
    hasMap: 'https://maps.google.com/?q=Manama,Bahrain',
    parentOrganization: { '@id': ORG_ID },
  },
  // ── United States ─────────────────────────────────────────────────────────
  {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'ElectronicsStore'],
    '@id': `${CANONICAL_SITE_URL}/#localbusiness-us`,
    name: 'ExTell Systems — United States',
    url: CANONICAL_SITE_URL,
    logo: canonicalUrl('/assets/logowhite.jpg'),
    image: canonicalUrl('/assets/homebg.jpg'),
    description:
      'ExTell Systems US — enterprise UPS systems, fiber cables, and ICT infrastructure solutions for North American customers.',
    email: 'sales@extellsystems.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    currenciesAccepted: 'USD',
    priceRange: '$$',
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
