export const SEO_KEYWORD_GROUPS = {
  structuredCabling: [
    'CAT6 Cable',
    'CAT6A Cable',
    'CAT6 LSZH Cable',
    'CAT6A LSZH Cable',
    'Single Mode Fiber Cable',
    'Direct Buried Fiber Cable',
    '42U Server Rack',
    'OM3 Fiber Cable',
    'OM4 Fiber Cable',
    'CAT6 Elevator Cable',
    'CAT6A Elevator Cable',
    'Smart PDU',
    'Monitored PDU',
    'CAT6 Patch Cords',
    'Fiber Patch Cords',
    'Fiber Patch Panels',
  ],
  ups: [
    'Industrial UPS',
    'Single Phase UPS',
    '1kVA UPS',
    'UPS for CCTV',
    'Outdoor UPS',
    '3kVA UPS',
    '9Ah VRLA Battery',
    '600VA UPS',
    '800VA UPS',
    '1000VA UPS',
    'Modular UPS',
    'UPS for Data Center',
    'UPS for Server Room',
    'Rack Mount UPS',
  ],
};

export const ALL_SEO_KEYWORDS = [
  ...SEO_KEYWORD_GROUPS.structuredCabling,
  ...SEO_KEYWORD_GROUPS.ups,
];

export function getProductSeoKeywords(product = {}) {
  const category = String(
    product.topCategory || product.Categories || product.category || ''
  ).toLowerCase();
  const productText = `${product.Name || product.name || ''} ${category}`.toLowerCase();
  const isUps = /ups|battery|power backup|power protection/.test(productText);
  const isNetworking = /cable|fiber|network|rack|pdu|structured|passive/.test(productText);

  if (isUps && !isNetworking) return SEO_KEYWORD_GROUPS.ups;
  if (isNetworking && !isUps) return SEO_KEYWORD_GROUPS.structuredCabling;
  return ALL_SEO_KEYWORDS;
}
