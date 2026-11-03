import { categories, products as siteProducts } from '@/data/siteData';
import { getProductPath } from '@/lib/productUrl';
import { SITE_FAQS } from '@/lib/siteFaqs';

const STOP_WORDS = new Set([
  'a', 'about', 'and', 'are', 'can', 'do', 'does', 'for', 'from', 'get', 'how',
  'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'please', 'the', 'to',
  'what', 'which', 'with', 'you', 'your', 'product', 'products', 'buy', 'purchase',
  'order', 'price', 'pricing', 'cost', 'quote', 'quotation', 'stock', 'available',
  'availability', 'delivery', 'warranty', 'period', 'shipping', 'ship', 'minimum', 'quantity'
]);
const FAQ_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'can', 'do', 'does', 'for', 'from',
  'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'please', 'the',
  'to', 'we', 'what', 'when', 'where', 'which', 'who', 'why', 'with', 'you', 'your'
]);

const clean = (value) => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const tokenize = (value) =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9.+-]+/g, ' ')
    .split(' ')
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));

const tokenizeFaq = (value) =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9.+-]+/g, ' ')
    .split(' ')
    .filter((word) => word.length > 1 && !FAQ_STOP_WORDS.has(word));

const unwrapProducts = (response) => {
  const candidates = [response, response?.items, response?.products, response?.data, response?.data?.items, response?.data?.products];
  return candidates.find(Array.isArray) || [];
};

const productText = (product) => {
  const specs = product?.specs && typeof product.specs === 'object'
    ? Object.entries(product.specs).map(([key, value]) => `${key} ${value}`).join(' ')
    : '';
  const rows = Array.isArray(product?.detailRows)
    ? product.detailRows.map((row) => `${row.parameter} ${row.value}`).join(' ')
    : '';
  const features = Array.isArray(product?.features)
    ? product.features.map((feature) => `${feature?.title || ''} ${feature?.detail || ''}`).join(' ')
    : '';
  const faqs = Array.isArray(product?.faqs)
    ? product.faqs.map((faq) => `${faq?.question || faq?.q || ''} ${faq?.answer || faq?.a || ''}`).join(' ')
    : '';
  return clean([
    product?.Name, product?.name, product?.SKU, product?.sku, product?.category,
    product?.Categories, product?.descriptionText, product?.description,
    product?.short, product?.shortDescription, specs, rows, features, faqs
  ].join(' ')).toLowerCase();
};

const rankProducts = (question, sourceProducts) => {
  const words = tokenize(question);
  if (!words.length) return [];

  return sourceProducts
    .map((product) => {
      const name = clean(product?.Name || product?.name).toLowerCase();
      const sku = clean(product?.SKU || product?.sku).toLowerCase();
      const searchable = productText(product);
      const score = words.reduce((total, word) => {
        if (sku.includes(word)) return total + 7;
        if (name.includes(word)) return total + 4;
        if (searchable.includes(word)) return total + 1;
        return total;
      }, name && question.toLowerCase().includes(name) ? 10 : 0);
      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ product }) => product);
};

const findMentionedProduct = (question, sourceProducts) => {
  const query = question.toLowerCase().replace(/[^a-z0-9]/g, '');
  const words = new Set(tokenize(question));
  const candidates = sourceProducts.map((product) => {
    const sku = clean(product?.SKU || product?.sku).toLowerCase();
    const skuCompact = sku.replace(/[^a-z0-9]/g, '');
    const nameWords = tokenize(product?.Name || product?.name);
    const matches = nameWords.filter((word) => words.has(word)).length;
    const exactSku = skuCompact.length > 3 && query.includes(skuCompact);
    return { product, exactSku, matches, nameWordCount: nameWords.length };
  });
  return candidates
    .filter(({ exactSku, matches, nameWordCount }) => exactSku || (matches >= 2 && matches / Math.max(nameWordCount, 2) >= 0.25))
    .sort((a, b) => Number(b.exactSku) - Number(a.exactSku) || b.matches - a.matches)[0]?.product || null;
};

const guidance = (text, source, links = []) => ({
  text,
  source,
  products: links.map(([name, href]) => ({ name, href }))
});

const createFaqIndex = (knowledge) => {
  const categoryFaqs = categories.flatMap((category) => [
    {
      q: `What ${category.name} products does ExTell Systems offer?`,
      a: `ExTell Systems offers a range of ${category.name} for enterprise, data center, and industrial applications. Browse the category catalog for current products.`,
      source: 'Category page',
      href: `/category/${category.slug}`
    },
    {
      q: `How do I get a quote for ${category.name} from ExTell Systems?`,
      a: `Select a ${category.name} product from the catalog and use “Get a Quote” on its product page. You can also email sales@extellsystems.com.`,
      source: 'Category page',
      href: `/category/${category.slug}`
    },
    {
      q: `Are ExTell Systems ${category.name} suitable for data centers?`,
      a: `The website presents ${category.name} for enterprise and data center applications. Check the selected product’s specifications and contact sales for a project-specific recommendation.`,
      source: 'Category page',
      href: `/category/${category.slug}`
    },
    {
      q: `What is the warranty on ExTell Systems ${category.name}?`,
      a: `Warranty periods vary by product model. Most ExTell Systems products carry a 1–2 year manufacturer warranty. Contact support@extellsystems.com for the specific product terms.`,
      source: 'Category page',
      href: `/category/${category.slug}`
    }
  ]);

  const productFaqs = knowledge.flatMap((product) => {
    const name = clean(product?.Name || product?.name || 'Product');
    const sku = clean(product?.SKU || product?.sku);
    const href = getProductPath(product);
    const id = String(product?.SKU || product?.sku || product?._id || product?.id || name);
    const rawFaqs = Array.isArray(product?.faqs) ? product.faqs : [];
    const mappedFaqs = rawFaqs.map((faq) => ({
      q: clean(faq?.question || faq?.q || faq?.title || faq?.heading || (typeof faq === 'string' ? faq : '')),
      a: clean(faq?.answer || faq?.a || faq?.detail || faq?.text || faq?.content || ''),
      productId: id,
      productName: name,
      sku,
      source: `${name} product page`,
      href
    })).filter((faq) => faq.q && faq.a);

    if (mappedFaqs.length) return mappedFaqs;
    const specs = getSpecs(product);
    const warranty = specs.find(([key]) => /warranty/i.test(String(key)))?.[1];
    const description = clean(product?.descriptionText || product?.description || product?.shortDescription || product?.short);
    const availability = product?.inStock === false
      ? `${name} may be available to order. Contact sales@extellsystems.com with your requirements for current availability and lead time.`
      : `${name} is listed as available for purchase. Submit a quote request on the product page or email sales@extellsystems.com to confirm current stock and lead time.`;
    return [
      ...(sku ? [{ q: `What is the model number of ${name}?`, a: `The model number or SKU for ${name} is ${sku}.`, productId: id, productName: name, sku, source: 'Product catalog', href }] : []),
      { q: `Is ${name} available for purchase?`, a: availability, productId: id, productName: name, sku, source: 'Product catalog', href },
      { q: `How do I get a price quote for ${name}?`, a: `Use the quote form on the ${name} product page and provide your requirements. You can also email sales@extellsystems.com.`, productId: id, productName: name, sku, source: 'Product catalog', href },
      ...(description ? [{ q: `What is ${name} used for?`, a: description, productId: id, productName: name, sku, source: 'Product catalog', href }] : []),
      ...(warranty ? [{ q: `What is the warranty on ${name}?`, a: `The published product information lists this warranty: ${warranty}. Contact support@extellsystems.com to confirm the full terms.`, productId: id, productName: name, sku, source: 'Product catalog', href }] : []),
      { q: `Where can I buy ${name}?`, a: `${name} is available through ExTell Systems directly. Browse the product page for the quote form, or contact sales@extellsystems.com for pricing and availability.`, productId: id, productName: name, sku, source: 'Product catalog', href }
    ];
  });

  return [...SITE_FAQS, ...categoryFaqs, ...productFaqs];
};

const findMatchingFaq = (question, knowledge, mentionedProduct) => {
  const queryWords = Array.from(new Set(tokenizeFaq(question)));
  if (queryWords.length < 2) return null;
  return createFaqIndex(knowledge)
    .filter((faq) => faq.q && faq.a)
    .filter((faq) => !faq.productId || (mentionedProduct && faq.productId === String(mentionedProduct?.SKU || mentionedProduct?.sku || mentionedProduct?._id || mentionedProduct?.id || mentionedProduct?.Name || mentionedProduct?.name)))
    .map((faq) => {
      const faqWords = new Set(tokenizeFaq(faq.q));
      const matchedWords = queryWords.filter((word) => faqWords.has(word));
      const score = matchedWords.length / queryWords.length + (faq.productId ? 0.12 : 0);
      return { faq, matchedWords, score };
    })
    .filter(({ matchedWords, score }) => matchedWords.length >= 2 && score >= 0.38)
    .sort((a, b) => b.score - a.score || b.matchedWords.length - a.matchedWords.length)[0]?.faq || null;
};

const getSpecs = (product) => {
  if (product?.specs && typeof product.specs === 'object') return Object.entries(product.specs);
  if (Array.isArray(product?.detailRows)) {
    return product.detailRows
      .filter((row) => row?.parameter && row?.value)
      .map((row) => [row.parameter, row.value]);
  }
  return [];
};

export const prepareProductKnowledge = (response) => {
  const liveProducts = unwrapProducts(response);
  const source = liveProducts.length ? liveProducts : siteProducts;
  const seen = new Set();
  return source.filter((product) => {
    const key = String(product?.SKU || product?.sku || product?._id || product?.id || product?.Name || product?.name || '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const findLeadProduct = (question, knowledge) => findMentionedProduct(question, knowledge);

export const answerSalesQuestion = (question, knowledge) => {
  const normalizedQuestion = question.toLowerCase();
  const asksHowToBuy =
    /\bhow\s+(?:can|do)\s+i\s+(?:buy|purchase|order)\b/.test(normalizedQuestion) ||
    /\bwhere\s+can\s+i\s+(?:buy|purchase|order)\b/.test(normalizedQuestion) ||
    /\bhow\s+to\s+(?:buy|purchase|order)\b/.test(normalizedQuestion) ||
    /\b(?:buy|purchase|order)\s+(?:a|an|any)\s+product\b/.test(normalizedQuestion);

  if (asksHowToBuy) {
    return {
      text: 'Browse the product catalog and open the item you need. On its product page, choose “Get a Quote” and share your requirements. The ExTell sales team can confirm pricing, stock, and delivery. You can also contact sales directly.',
      source: 'ExTell product and contact pages',
      products: [
        { name: 'Browse products', href: '/products' },
        { name: 'Contact sales', href: '/contact' }
      ]
    };
  }

  const mentionedProduct = findMentionedProduct(question, knowledge);
  const matchingFaq = findMatchingFaq(question, knowledge, mentionedProduct);
  if (matchingFaq) {
    return {
      text: matchingFaq.a,
      source: matchingFaq.source || 'Website FAQ',
      products: matchingFaq.href
        ? [{ name: matchingFaq.productName ? `View ${matchingFaq.productName}` : 'Learn more', href: matchingFaq.href, sku: matchingFaq.sku || '' }]
        : []
    };
  }

  const salesLinks = [['Browse products', '/products'], ['Contact sales', '/contact']];
  const productLink = mentionedProduct
    ? [[`View ${clean(mentionedProduct.Name || mentionedProduct.name)}`, getProductPath(mentionedProduct)]]
    : [];
  const asksPrice = /\b(price|pricing|cost|how much|quote|quotation|budget)\b/.test(normalizedQuestion);
  const asksAvailability = /\b(stock|available|availability|delivery|lead time|dispatch)\b/.test(normalizedQuestion);
  const asksWarranty = /\b(warranty|guarantee|coverage|warranty period)\b/.test(normalizedQuestion);
  const asksShipping = /\b(ship|shipping|deliver|delivery|international|country|countries)\b/.test(normalizedQuestion);
  const asksMinimumOrder = /\b(minimum order|minimum quantity|moq|order quantity)\b/.test(normalizedQuestion);
  const asksQuoteProcess = /\b(how|where|request|submit|need)\b/.test(normalizedQuestion) && /\b(quote|quotation)\b/.test(normalizedQuestion);
  const asksRecommendation = /\b(recommend|recommendation|which|suitable|right product|selection|choose)\b/.test(normalizedQuestion);

  if (!mentionedProduct && asksPrice) {
    return guidance('Product pricing is not published in the catalog. ExTell is a B2B supplier: open a product page and use “Get a Quote,” or contact sales with the product name, quantity, and delivery location. The website says sales inquiries are typically answered within two business hours.', 'Product and contact pages', salesLinks);
  }
  if (!mentionedProduct && asksAvailability) {
    return guidance('Current stock and delivery dates depend on the product and destination. Share the product name or SKU, quantity, and delivery location with sales to confirm availability.', 'Product catalog', salesLinks);
  }
  if (!mentionedProduct && asksWarranty) {
    return guidance('Warranty terms vary by product. The website says most UPS products carry a 1–2 year manufacturer warranty; ask support for the terms for a specific model. You can also register a product on the warranty page.', 'Support and warranty pages', [['Warranty registration', '/warranty'], ['Contact support', '/contact']]);
  }
  if (!mentionedProduct && asksShipping) {
    return guidance('ExTell states that it serves customers in more than 20 countries, including India, UAE, Bahrain, Saudi Arabia, Kuwait, Oman, and the United States. Shipping terms depend on the destination; contact sales with your location and product requirements.', 'Product catalog FAQ', salesLinks);
  }
  if (!mentionedProduct && asksMinimumOrder) {
    return guidance('Minimum order quantities vary by product line. Send sales the product or category, required quantity, and project details so they can confirm the applicable minimum.', 'Product catalog FAQ', salesLinks);
  }
  if (asksQuoteProcess) {
    return guidance('Open the product you need and use the “Get a Quote” form. Include the quantity, application, and delivery location so the team can provide relevant pricing and availability. You can also contact sales directly.', 'Product pages', productLink.length ? productLink : salesLinks);
  }
  if (!mentionedProduct && asksRecommendation) {
    return guidance('I can help narrow down the catalog. Tell me the application, required capacity or performance, installation environment, quantity, and delivery location. For a confirmed recommendation, send those requirements to sales.', 'Product catalog', salesLinks);
  }

  const matches = rankProducts(question, knowledge);
  const wantsPricing = asksPrice;
  const wantsAvailability = asksAvailability;

  if (!matches.length) {
    const categoryMatch = categories.find((category) =>
      normalizedQuestion.includes(category.name.toLowerCase()) || normalizedQuestion.includes(category.slug.replace(/-/g, ' '))
    );
    if (categoryMatch) {
      return {
        text: `ExTell lists ${categoryMatch.name} in its product range. I couldn't find a specific product match for that question in the published catalog. Share the required capacity, application, and location, and our sales team can recommend an option.`,
        products: [],
        source: 'Product catalog'
      };
    }
    return {
      text: 'I couldn’t find that detail in the published product information. Tell me the product name or SKU, or describe the application and key requirements, and I’ll look for the closest catalog match. For a confirmed recommendation, pricing, or availability, I can pass your inquiry to the sales team.',
      products: [],
      source: 'ExTell website'
    };
  }

  const product = matches[0];
  const name = clean(product.Name || product.name || 'Product');
  const sku = clean(product.SKU || product.sku);
  const category = clean(product.Categories || product.category);
  const description = clean(product.descriptionText || product.description || product.shortDescription || product.short);
  const specs = getSpecs(product).slice(0, 5);
  const features = Array.isArray(product.features)
    ? product.features.map((feature) => clean(feature?.title || feature?.name || feature)).filter(Boolean).slice(0, 4)
    : [];

  let text = `${name}${sku ? ` (SKU: ${sku})` : ''}.`;
  if (category) text += ` Category: ${category}.`;
  if (description) text += ` ${description}`;
  if (specs.length) text += ` Key specifications: ${specs.map(([key, value]) => `${clean(key)}: ${clean(value)}`).join('; ')}.`;
  if (features.length) text += ` Features: ${features.join(', ')}.`;
  if (wantsAvailability) {
    if (typeof product.inStock === 'boolean') {
      text += product.inStock
        ? ' The catalog currently marks this product as in stock.'
        : ' The catalog currently marks this product as out of stock.';
    } else {
      text += ' Current stock and delivery timing are not listed in the published catalog; please request confirmation.';
    }
  }
  if (wantsPricing) text += ' Pricing depends on configuration and order requirements; request a quote for current pricing.';
  if (!description && !specs.length && !features.length) {
    text += ' The public catalog has limited specifications for this item, so I can’t confirm more technical details.';
  }

  return {
    text,
    source: 'Product catalog',
    products: matches.map((item) => ({
      name: clean(item.Name || item.name || 'Product'),
      sku: clean(item.SKU || item.sku),
      href: getProductPath(item)
    }))
  };
};
